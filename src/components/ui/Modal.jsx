import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

function Modal({ isOpen, title, children, onClose }) {
  const shouldCloseFromOverlayRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        document.activeElement?.blur();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  function handleOverlayMouseDown(event) {
    shouldCloseFromOverlayRef.current = event.target === event.currentTarget;
  }

  function handleOverlayMouseUp(event) {
    const endedOnOverlay = event.target === event.currentTarget;

    if (shouldCloseFromOverlayRef.current && endedOnOverlay) {
      document.activeElement?.blur();
      onClose();
    }

    shouldCloseFromOverlayRef.current = false;
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center px-4"
          onMouseDown={handleOverlayMouseDown}
          onMouseUp={handleOverlayMouseUp}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className="modal-panel"
            onMouseDown={() => {
              shouldCloseFromOverlayRef.current = false;
            }}
            initial={{ y: 18, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 10, scale: 0.98 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <div className="modal-header">
              <h2 className="modal-title modal-title-text text-lg font-semibold">
                {title}
              </h2>
            </div>

            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default Modal;
