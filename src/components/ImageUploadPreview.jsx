import styles from './ImageUploadPreview.module.css';

const ImageUploadPreview = ({ photoUrl, onUpload, onDelete, onPreview, disabled = false }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className={styles.container}>
      {!photoUrl ? (
        <label className={`${styles.uploadButton} ${disabled ? styles.disabled : ''}`}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            disabled={disabled}
            className={styles.fileInput}
          />
          <svg
            className={styles.uploadIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className={styles.uploadText}>Upload Image</span>
        </label>
      ) : (
        <div className={styles.uploadedContainer}>
          <div className={styles.uploadedChip}>
            <svg
              className={styles.checkIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className={styles.chipText}>Image uploaded</span>
          </div>
          {!disabled && (
            <div className={styles.actions}>
              <button
                type="button"
                onClick={onPreview}
                className={styles.previewButton}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={onDelete}
                className={styles.deleteIcon}
                aria-label="Delete photo"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadPreview;
