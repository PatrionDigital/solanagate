import { Button, Card } from "@windmill/react-ui";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const ActionConfirmModal = ({ open, onConfirm, onCancel, actionLabel, actionPrice }) => {
  const [show, setShow] = useState(open);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
      // Animate in next tick
      setTimeout(() => setAnimate(true), 10);
    } else if (show) {
      setAnimate(false);
      // Wait for animation out before hiding
      const timeout = setTimeout(() => setShow(false), 180);
      return () => clearTimeout(timeout);
    }
  }, [open, show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`transition-all duration-200 ease-out transform ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg`}
        style={{ pointerEvents: animate ? 'auto' : 'none' }}
      >
        <Card className="p-6 flex flex-col items-center !bg-[rgba(30,30,30,0.97)] border border-gold rounded-lg shadow-2xl">
          <h3 className="text-lg font-bold text-gold mb-4">Confirm Action</h3>
          <p className="mb-2 text-white">Do you want to {actionLabel}?</p>
          {actionPrice && (
            <p className="mb-6 text-red-200 font-semibold">This costs {actionPrice} $VERMIN</p>
          )}
          <div className="flex gap-4 w-full justify-center">
            <Button
              type="button"
              className="primary w-full"
              onClick={onConfirm}
            >
              Ok
            </Button>
            <Button
              type="button"
              className="cancel w-full"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

ActionConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  actionLabel: PropTypes.string.isRequired,
  actionPrice: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
};

export default ActionConfirmModal;
