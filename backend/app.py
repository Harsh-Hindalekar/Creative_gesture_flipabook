from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'devkey')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Allow requests from frontend
frontend = os.getenv('FRONTEND_URL', 'http://localhost:5173')
CORS(app, resources={r"/api/*": {"origins": frontend}, r"/recognize": {"origins": frontend}, r"/smooth_stroke": {"origins": frontend}})

db = SQLAlchemy(app)
jwt = JWTManager(app)

app_setup_done = False

# ------------ Models ------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email}

@app.before_request
def create_tables_on_first_request():
    global app_setup_done
    if not app_setup_done:
        db.create_all()
        print("Database tables created.")
        app_setup_done = True

# ------------ Auth routes ------------
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '')
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"msg": "email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "user already exists"}), 400

    user = User(name=name, email=email, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user": user.to_dict()}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user": user.to_dict()})

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user.to_dict())

# ------------ Placeholder AI endpoints ------------
@app.route('/api/recognize', methods=['POST'])
def recognize():
    return jsonify({"shape": "triangle", "confidence": 0.9})

@app.route('/api/smooth_stroke', methods=['POST'])
def smooth_stroke():
    data = request.get_json() or {}
    return jsonify({"points": data.get("points", [])})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
