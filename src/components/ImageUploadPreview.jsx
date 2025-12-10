import styles from './ImageUploadPreview.module.css';

const ImageUploadPreview = ({ photoUrl, onUpload, onDelete, disabled = false }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className={styles.container}>
      {!photoUrl ? (
        <label className={`${styles.uploadLabel} ${disabled ? styles.disabled : ''}`}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            disabled={disabled}
            className={styles.fileInput}
          />
          <div className={styles.uploadPrompt}>
            <svg
              className={styles.uploadIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="48"
              height="48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className={styles.uploadText}>Upload Photo</span>
            <span className={styles.uploadHint}>Click to capture or select image</span>
          </div>
        </label>
      ) : (
        <div className={styles.previewContainer}>
          <img src={photoUrl} alt="Checkpoint preview" className={styles.thumbnail} />
          {!disabled && (
            <button
              type="button"
              onClick={onDelete}
              className={styles.deleteButton}
              aria-label="Delete photo"
            >
              <svg
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadPreview;
