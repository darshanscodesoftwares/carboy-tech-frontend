import { useState } from 'react';
import ImageUploadPreview from './ImageUploadPreview';
import ImagePreviewModal from './ImagePreviewModal';
import styles from './ChecklistItem.module.css';

const ChecklistItem = ({ item, onSubmit, isSubmitting, existingAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(existingAnswer?.selectedOption || '');
  const [notes, setNotes] = useState(existingAnswer?.notes || '');
  const [photoUrl, setPhotoUrl] = useState(existingAnswer?.photoUrl || '');
  const [showPreview, setShowPreview] = useState(false);
  const isCompleted = !!existingAnswer;

  const handleSubmit = () => {
    if (!selectedOption) return;
    onSubmit({ checkpointKey: item.key, selectedOption, notes, photoUrl: photoUrl || null });
  };

  const handlePhotoUpload = (file) => {
    if (file) setPhotoUrl(URL.createObjectURL(file));
  };

  const handlePhotoDelete = () => {
    setPhotoUrl('');
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <>
      <div className={`${styles.card} ${isCompleted ? styles.completed : styles.pending}`}>
        <div className={styles.header}>
          <span className={styles.label}>{item.label}</span>
        </div>

        <div className={styles.content}>
          <div className={styles.optionsGrid}>
            {item.options.map((option) => (
              <button
                key={option}
                type="button"
                disabled={isCompleted}
                onClick={() => setSelectedOption(option)}
                className={`${styles.optionButton} ${selectedOption === option ? styles.selected : ''}`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className={styles.uploadSection}>
            <ImageUploadPreview
              photoUrl={photoUrl}
              onUpload={handlePhotoUpload}
              onDelete={handlePhotoDelete}
              onPreview={handlePreview}
              disabled={isCompleted}
            />
          </div>

          {!isCompleted && (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption || isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner} />
                  Saving...
                </>
              ) : (
                'Save Checkpoint'
              )}
            </button>
          )}
          {isCompleted && <div className={styles.saved}>✓ Checkpoint saved</div>}
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
