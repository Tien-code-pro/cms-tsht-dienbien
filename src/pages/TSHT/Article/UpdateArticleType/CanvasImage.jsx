import React, { useState, useRef, useEffect } from "react";
import Bubble from "./Bubble";
import CreateCommentDemo from "./CreateComment";
export default function CanvasImage({ children }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    // Set the line color and width
    ctx.strokeStyle = "#000000"; // Màu đen
    ctx.lineWidth = 1;
    // Draw vertical lines
    for (let x = 0; x <= width; x += 4) {
      //   ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    // Draw horizontal lines
    for (let y = 0; y <= height; y += 4) {
      //   ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  }, []);
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <canvas
        id="canvas"
        ref={canvasRef}
        style={{
          border: "1px solid black",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          display: "none",
        }}
      ></canvas>
      {/* <Bubble /> */}
      <CreateCommentDemo />
      {children}
    </div>
  );
}
