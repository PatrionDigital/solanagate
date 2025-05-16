// src/games/spinner/Wheel.jsx
import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "@/styles/SpinnerGame.css";
import { PRIZE_SEGMENTS } from "@/utils/spinnerUtils";

const Wheel = ({ isSpinning, prizeIndex, onSpinComplete }) => {
  const wheelRef = useRef(null);
  const canvasRef = useRef(null);
  const spinTimeoutRef = useRef(null); // Track spin animation timeout
  const prevIsSpinning = useRef(false); // Track previous isSpinning for transition detection


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
    // Offset so that segment 0 is centered at the top (0deg), and correct for observed shift of 2
    const offset = -segmentAngle / 2 - (2 * segmentAngle);
    PRIZE_SEGMENTS.forEach((segment, index) => {
      const startAngle = offset + index * segmentAngle;
      const endAngle = offset + (index + 1) * segmentAngle;
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
      // --- DEBUG: Draw prize index number in each segment ---
      // --- END DEBUG ---
      ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill(); // Remove triangle marker from canvas drawing

  }, []);

  // Only animate/reset when isSpinning transitions from false to true
  useEffect(() => {
    if (!wheelRef.current) return;
    // Clear previous timeout
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    // Detect transition from not spinning to spinning
    if (!prevIsSpinning.current && isSpinning) {
      console.log('[Wheel] isSpinning transitioned to true. Starting animation. prizeIndex:', prizeIndex);
      // Step 1: Instantly reset wheel to 0deg, no transition
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = 'rotate(0deg)';
      // Step 2: Force browser to apply styles before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!wheelRef.current) return;
          const segmentAngle = 360 / PRIZE_SEGMENTS.length;
          const fullRotations = 5 * 360;
          const totalRotation = fullRotations - (prizeIndex * segmentAngle);
          wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)';
          wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
          // Schedule spin complete callback after animation
          spinTimeoutRef.current = setTimeout(() => {
            spinTimeoutRef.current = null;
            console.log('[Wheel] Spin animation complete. Calling onSpinComplete.');
            if (onSpinComplete) onSpinComplete();
          }, 4000);
        });
      });
    }
    prevIsSpinning.current = isSpinning;
    // Cleanup on unmount or re-spin
    return () => {
      if (spinTimeoutRef.current) {
        console.log('[Wheel] Cleaning up spinTimeout before animation complete.');
        clearTimeout(spinTimeoutRef.current);
        spinTimeoutRef.current = null;
      }
    };
  }, [isSpinning, prizeIndex, onSpinComplete]);

  return (
    <div className="vermin-spinner-wheel-container" style={{ position: 'relative', width: 300, height: 300 }}>
      {/* Single red triangle marker at the top */}
      <div
        className="vermin-spinner-wheel-marker"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -10px)',
          width: 0,
          height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '20px solid #FF0000',
          borderBottom: 'none',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
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
