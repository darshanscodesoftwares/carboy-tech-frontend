import { useState, useRef } from 'react';
import ImagePreviewModal from './ImagePreviewModal';
import styles from './ChecklistItem.module.css';
import { MdDelete } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { IoIosCamera } from "react-icons/io";

const ChecklistItem = ({ item, onSubmit, isSubmitting, existingAnswer, isEditMode }) => {
  const [selectedOption, setSelectedOption] = useState(existingAnswer?.selectedOption || '');
  const [notes, setNotes] = useState(existingAnswer?.notes || '');
  const [photoUrl, setPhotoUrl] = useState(existingAnswer?.photoUrl || '');
  const [showPreview, setShowPreview] = useState(false);
  const uploadInputRef = useRef(null);
  const captureInputRef = useRef(null);

  // Auto-save when option is selected
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    // Auto-save immediately
    onSubmit({
      checkpointKey: item.key,
      selectedOption: option,
      notes,
      photoUrl: photoUrl || null
    });
  };

  const handlePhotoUpload = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      // Auto-save if option already selected
      if (selectedOption) {
        onSubmit({
          checkpointKey: item.key,
          selectedOption,
          notes,
          photoUrl: url
        });
      }
    }
  };

  const handlePhotoDelete = () => {
    setPhotoUrl('');
    // Auto-save with photoUrl = null
    if (selectedOption) {
      onSubmit({
        checkpointKey: item.key,
        selectedOption,
        notes,
        photoUrl: null
      });
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const handleCaptureClick = () => {
    captureInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  return (
    <>
      <div className={`${styles.card} ${existingAnswer ? styles.completed : styles.pending}`}>
        <div className={styles.header}>
          <span className={styles.label}>{item.label}</span>
        </div>

           <div className={styles.uploadSection}>
            {!photoUrl ? (
              <div className={styles.uploadButtons}>
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                <input
                  ref={captureInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className={styles.uploadButton}
                >
                <FiUpload />  Upload 
                </button>
                <button
                  type="button"
                  onClick={handleCaptureClick}
                  className={styles.captureButton}
                >
                  <IoIosCamera />
                </button>
              </div>
            ) : (
              // <div className={styles.imagePreviewContainer}>
              //   <div className={styles.thumbnailWrapper}>
              //     <img
              //       src={photoUrl}
              //       alt="Uploaded"
              //       className={styles.thumbnail}
              //       onClick={handlePreview}
              //     />
              //   </div>
              //   <button
              //     type="button"
              //     onClick={handlePhotoDelete}
              //     className={styles.deleteButton}
              //     aria-label="Delete photo"
              //   >
              //       <path
              //         strokeLinecap="round"
              //         strokeLinejoin="round"
              //         strokeWidth={2}
              //         d="M19 7l-.867 12.142A2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              //       />
              //     Delete
              //   </button>
              // </div>

              <div className={styles.previewRow}>
                <img
                  src={photoUrl}
                  alt="Uploaded"
                  className={styles.previewThumb}
                  onClick={handlePreview}
                />

                <button
                  type="button"
                  onClick={handlePhotoDelete}
                  className={styles.deleteIconButton}
                  aria-label="Delete photo"
                >
                  <MdDelete />
                </button>
              </div>

            )}
          </div>

        <div className={styles.content}>
          <div className={styles.optionsGrid}>
            {item.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`${styles.optionButton} ${selectedOption === option ? styles.selected : ''}`}
              >
                {option}
              </button>
            ))}
          </div>

       

          {isSubmitting && (
            <div className={styles.savingIndicator}>
              <div className={styles.spinner} />
              <span>Saving...</span>
            </div>
          )}
        </div>
      </div>

      <ImagePreviewModal
        isOpen={showPreview}
        imageUrl={photoUrl}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
};

export default ChecklistItem;
