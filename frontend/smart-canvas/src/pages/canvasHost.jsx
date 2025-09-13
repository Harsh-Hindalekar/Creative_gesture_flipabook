import { useRef, useState } from "react";

export default function CanvasHost() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  function startDrawing(e) {
    setDrawing(true);
    draw(e);
  }

  function stopDrawing() {
    setDrawing(false);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
  }

  function draw(e) {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }

  return (
    <div>
      <h2>Canvas</h2>
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        style={{ border: "1px solid black" }}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
      />
    </div>
  );
}
