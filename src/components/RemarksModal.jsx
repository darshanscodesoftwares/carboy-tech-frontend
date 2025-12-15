import { useState, useEffect } from 'react';
import styles from './RemarksModal.module.css';

const RemarksModal = ({ isOpen, onClose, onSubmit, initialRemark = '' }) => {
  const [remark, setRemark] = useState(initialRemark);

  useEffect(() => {
    setRemark(initialRemark);
  }, [initialRemark]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(remark.trim());
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      {/* Side Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : styles.drawerClosed}`}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Add Remark</h2>
            <p className={styles.subtitle}>Inspection Expert (IE) Remarks (optional)</p>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close drawer"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <textarea
            className={styles.textarea}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter your remarks here... These remarks will be included in the inspection report and may be used by the admin to modify the report if needed."
            rows={8}
            autoFocus={isOpen}
          />
          <p className={styles.hint}>
            These remarks are optional and will be included in your final inspection report.
          </p>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.submitButton} onClick={handleSubmit}>
            Submit Remark
          </button>
        </div>
      </div>
    </>
  );
};

export default RemarksModal;
