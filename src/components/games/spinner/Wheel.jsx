// src/components/games/spinner/Wheel.jsx
import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "@/styles/SpinnerGame.css";
import { PRIZE_SEGMENTS } from "@/utils/spinnerUtils";

const Wheel = ({ isSpinning, prizeIndex, onSpinComplete }) => {
  const wheelRef = useRef(null);
  const canvasRef = useRef(null);

  // Draw the wheel on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const segmentAngle = (2 * Math.PI) / PRIZE_SEGMENTS.length;
    PRIZE_SEGMENTS.forEach((segment, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Arial";
      ctx.fillText(segment.label, radius - 20, 5);
      ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 10);
    ctx.lineTo(centerX - 10, centerY - radius + 10);
    ctx.lineTo(centerX + 10, centerY - radius + 10);
    ctx.closePath();
    ctx.fillStyle = "#FF0000";
    ctx.fill();
  }, []);

  // Handle spinning animation
  useEffect(() => {
    if (!wheelRef.current || !isSpinning) return;
    wheelRef.current.style.transform = "rotate(0deg)";
    const segmentAngle = 360 / PRIZE_SEGMENTS.length;
    const selectedSegment = PRIZE_SEGMENTS.length - 1 - prizeIndex;
    const finalRotation = selectedSegment * segmentAngle;
    const fullRotations = 5 * 360;
    const totalRotation = fullRotations + finalRotation;
    setTimeout(() => {
      wheelRef.current.style.transition = "transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)";
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
      setTimeout(() => {
        if (onSpinComplete) onSpinComplete();
      }, 4000);
    }, 100);
  }, [isSpinning, prizeIndex, onSpinComplete]);

  return (
    <div className="vermin-spinner-wheel-container">
      <div className="vermin-spinner-wheel-marker"></div>
      <div ref={wheelRef} className="vermin-spinner-wheel">
        <canvas ref={canvasRef} width={300} height={300} className="vermin-spinner-wheel-canvas" />
      </div>
    </div>
  );
};

Wheel.propTypes = {
  isSpinning: PropTypes.bool.isRequired,
  prizeIndex: PropTypes.number.isRequired,
  onSpinComplete: PropTypes.func,
};

Wheel.defaultProps = {
  onSpinComplete: () => {},
};

export default Wheel;
