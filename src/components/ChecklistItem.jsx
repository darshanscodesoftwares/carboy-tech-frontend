
import { useState } from 'react';
import ImageUploadPreview from './ImageUploadPreview';
import styles from './ChecklistItem.module.css';

const ChecklistItem = ({ item, onSubmit, isSubmitting, existingAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(existingAnswer?.selectedOption || '');
  const [notes, setNotes] = useState(existingAnswer?.notes || '');
  const [photoUrl, setPhotoUrl] = useState(existingAnswer?.photoUrl || '');
  const [isExpanded, setIsExpanded] = useState(!existingAnswer);
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

  return (
    <div className={`${styles.card} ${isCompleted ? styles.completed : styles.pending}`}>
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={styles.headerLeft}>
          <div className={`${styles.statusIcon} ${isCompleted ? styles.completed : styles.pending}`}>
            {isCompleted ? <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              : <span className={styles.questionMark}>?</span>}
          </div>
          <span className={styles.label}>{item.label}</span>
        </div>
        <svg className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isExpanded && (
        <div className={styles.content}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Select condition:</label>
            <div className={styles.optionsGrid}>
              {item.options.map((option) => (
                <button key={option} type="button" disabled={isCompleted} onClick={() => setSelectedOption(option)}
                  className={`${styles.optionButton} ${selectedOption === option ? styles.selected : ''}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Notes (optional):</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={isCompleted} placeholder="Add any additional notes..." className={styles.textarea} rows={2} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Photo (optional):</label>
            <ImageUploadPreview
              photoUrl={photoUrl}
              onUpload={handlePhotoUpload}
              onDelete={handlePhotoDelete}
              disabled={isCompleted}
            />
          </div>
          {!isCompleted && (
            <button onClick={handleSubmit} disabled={!selectedOption || isSubmitting} className={styles.submitButton}>
              {isSubmitting ? <><div className={styles.spinner} />Saving...</> : 'Save Checkpoint'}
            </button>
          )}
          {isCompleted && <div className={styles.saved}>Checkpoint saved</div>}
        </div>
      )}
    </div>
  );
};

export default ChecklistItem;
