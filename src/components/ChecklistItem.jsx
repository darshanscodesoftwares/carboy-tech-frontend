import { useState, useRef, useEffect, useCallback } from 'react';
import ImagePreviewModal from './ImagePreviewModal';
import styles from './ChecklistItem.module.css';
import { MdDelete, MdCheck, MdSave } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { IoIosCamera } from "react-icons/io";

const ChecklistItem = ({ item, onSubmit, isSubmitting, existingAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(existingAnswer?.selectedOption || '');
  const [textValue, setTextValue] = useState(existingAnswer?.value || '');
  const [notes, setNotes] = useState(existingAnswer?.notes || '');
  const [photoUrl, setPhotoUrl] = useState(existingAnswer?.photoUrl || '');
  const [photoUrls, setPhotoUrls] = useState(existingAnswer?.photoUrls || []);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isTextDirty, setIsTextDirty] = useState(false);
  const [isTextSaved, setIsTextSaved] = useState(false);

  const uploadInputRef = useRef(null);
  const captureInputRef = useRef(null);
  const multiUploadInputRef = useRef(null);
  const multiCaptureInputRef = useRef(null);

  const inputType = item.inputType || 'radio';

  // =========================
  // AUTO SAVE (FIXED PAYLOAD)
  // =========================
  const autoSave = useCallback((updates = {}) => {
    const payload = {
      checkpointKey: item.key,
      selectedOption: updates.selectedOption ?? selectedOption ?? null,
      value: updates.value ?? textValue ?? null,
      notes: updates.notes ?? notes ?? null,
      photoUrl: updates.photoUrl ?? photoUrl ?? null,
      photoUrls: updates.photoUrls ?? (photoUrls.length > 0 ? photoUrls : null)
    };

    onSubmit(payload);
  }, [item.key, selectedOption, textValue, notes, photoUrl, photoUrls, onSubmit]);

  // =========================
  // REHYDRATE FROM BACKEND
  // =========================
  useEffect(() => {
    if (!existingAnswer) return;

    setSelectedOption(existingAnswer.selectedOption || '');
    setTextValue(existingAnswer.value || '');
    setNotes(existingAnswer.notes || '');
    setPhotoUrl(existingAnswer.photoUrl || '');
    setPhotoUrls(existingAnswer.photoUrls || []);
  }, [existingAnswer]);

  // =========================
  // AUTO SELECT SINGLE DROPDOWN
  // =========================
  useEffect(() => {
    if (
      inputType === 'dropdown' &&
      item.options &&
      item.options.length === 1 &&
      !selectedOption
    ) {
      const value = item.options[0];
      setSelectedOption(value);
      autoSave({ selectedOption: value });
    }
  }, [item.options, inputType, selectedOption, autoSave]);

  // =========================
  // TEXT / TEXTAREA HANDLERS
  // =========================
  const handleTextChange = (e) => {
    setTextValue(e.target.value ?? '');
    setIsTextDirty(true);
    setIsTextSaved(false);
  };

  const handleTextSave = () => {
    autoSave({ value: textValue });
    setIsTextDirty(false);
    setIsTextSaved(true);
    setTimeout(() => setIsTextSaved(false), 1500);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    autoSave({ selectedOption: option });
  };

  // =========================
  // IMAGE HANDLERS
  // =========================
  const handlePhotoUpload = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    autoSave({ photoUrl: url });
  };

  const handlePhotoDelete = () => {
    setPhotoUrl('');
    autoSave({ photoUrl: null });
  };

  const handleMultiPhotoUpload = (files) => {
    const urls = Array.from(files || []).map(f => URL.createObjectURL(f));
    const updated = [...photoUrls, ...urls];
    setPhotoUrls(updated);
    autoSave({ photoUrls: updated });
  };

  const handleMultiPhotoDelete = (index) => {
    const updated = photoUrls.filter((_, i) => i !== index);
    setPhotoUrls(updated);
    autoSave({ photoUrls: updated.length ? updated : null });
  };

  // =========================
  // RENDER INPUT
  // =========================
  const renderInput = () => {
    const safeText = textValue ?? '';

    switch (inputType) {
      case 'text':
      case 'textarea':
        return (
          <div className={styles.textInputWrapper}>
            {inputType === 'text' ? (
              <input
                type="text"
                value={safeText}
                onChange={handleTextChange}
                className={styles.textInput}
              />
            ) : (
              <textarea
                value={safeText}
                onChange={handleTextChange}
                className={styles.textareaInput}
                rows={4}
              />
            )}

            {(isTextDirty || isTextSaved) && (
              <button
                type="button"
                onClick={handleTextSave}
                className={`${styles.inlineSaveButton} ${isTextSaved ? styles.saved : ''}`}
              >
                {isTextSaved ? <MdCheck /> : <MdSave />}
              </button>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className={styles.optionsGrid}>
            {item.options?.map(option => (
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
        );

      case 'dropdown':
        return (
          <select
            value={selectedOption}
            onChange={(e) => handleOptionSelect(e.target.value)}
            className={styles.dropdownInput}
          >
            <option value="">-- Select --</option>
            {item.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'image':
        return (
          <div className={styles.uploadSection}>
            {!photoUrl ? (
              <>
                <input type="file" accept="image/*" onChange={e => handlePhotoUpload(e.target.files[0])} />
              </>
            ) : (
              <div className={styles.previewRow}>
                <img src={photoUrl} alt="preview" onClick={() => setPreviewImage(photoUrl)} />
                <button onClick={handlePhotoDelete}><MdDelete /></button>
              </div>
            )}
          </div>
        );

      case 'multi-image':
        return (
          <div className={styles.uploadSection}>
            <input type="file" multiple accept="image/*" onChange={e => handleMultiPhotoUpload(e.target.files)} />
            {photoUrls.map((url, i) => (
              <div key={i}>
                <img src={url} alt="" onClick={() => setPreviewImage(url)} />
                <button onClick={() => handleMultiPhotoDelete(i)}><MdDelete /></button>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const isCompleted = () => {
    if (inputType === 'text' || inputType === 'textarea') return (textValue ?? '').trim() !== '';
    if (inputType === 'image') return !!photoUrl;
    if (inputType === 'multi-image') return photoUrls.length > 0;
    return selectedOption !== '';
  };

  return (
    <>
      <div className={`${styles.card} ${isCompleted() ? styles.completed : styles.pending}`}>
        <div className={styles.header}>
          <span>{item.label}</span>
        </div>
        <div className={styles.content}>
          {renderInput()}
        </div>
      </div>

      <ImagePreviewModal
        isOpen={!!previewImage}
        imageUrl={previewImage}
        onClose={() => setPreviewImage('')}
      />
    </>
  );
};

export default ChecklistItem;
