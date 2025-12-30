import { useState, useRef, useEffect, useCallback } from 'react';
import ImagePreviewModal from './ImagePreviewModal';
import styles from './ChecklistItem.module.css';
import { MdDelete, MdCheck, MdSave } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { IoIosCamera } from "react-icons/io";

const ChecklistItem = ({ item, onSubmit, isSubmitting, existingAnswer, isEditMode }) => {
  const [selectedOption, setSelectedOption] = useState(existingAnswer?.selectedOption || '');
  const [textValue, setTextValue] = useState(existingAnswer?.textValue || '');
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

  const inputType = item.inputType || 'radio'; // Default to radio for backward compatibility

  // Auto-save helper
  const autoSave = useCallback((updates = {}) => {
    const payload = {
      checkpointKey: item.key,
      selectedOption: updates.selectedOption !== undefined ? updates.selectedOption : selectedOption,
      textValue: updates.textValue !== undefined ? updates.textValue : textValue,
      notes: updates.notes !== undefined ? updates.notes : notes,
      photoUrl: updates.photoUrl !== undefined ? updates.photoUrl : (photoUrl || null),
      photoUrls: updates.photoUrls !== undefined ? updates.photoUrls : (photoUrls.length > 0 ? photoUrls : null)
    };
    onSubmit(payload);
  }, [item.key, selectedOption, textValue, notes, photoUrl, photoUrls, onSubmit]);

  // Update state when existingAnswer changes (e.g., when loading saved data)
  useEffect(() => {
    if (existingAnswer) {
      if (existingAnswer.selectedOption !== undefined) setSelectedOption(existingAnswer.selectedOption);
      if (existingAnswer.textValue !== undefined) setTextValue(existingAnswer.textValue);
      if (existingAnswer.notes !== undefined) setNotes(existingAnswer.notes);
      if (existingAnswer.photoUrl !== undefined) setPhotoUrl(existingAnswer.photoUrl);
      if (existingAnswer.photoUrls !== undefined) setPhotoUrls(existingAnswer.photoUrls);
    }
  }, [existingAnswer]);

  // Auto-select dropdown if only one option
  useEffect(() => {
    if (inputType === 'dropdown' && item.options && item.options.length === 1 && !selectedOption) {
      const singleOption = item.options[0];
      setSelectedOption(singleOption);
      autoSave({ selectedOption: singleOption });
    }
  }, [item.options, inputType, selectedOption, autoSave]);

  // Handle text input
  const handleTextChange = (e) => {
    const value = e.target.value;
    setTextValue(value);
    setIsTextDirty(true);
    setIsTextSaved(false);
  };

  const handleTextSave = () => {
    autoSave({ textValue });
    setIsTextDirty(false);
    setIsTextSaved(true);
    setTimeout(() => setIsTextSaved(false), 2000);
  };

  // Handle textarea
  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setTextValue(value);
    setIsTextDirty(true);
    setIsTextSaved(false);
  };

  const handleTextareaSave = () => {
    autoSave({ textValue });
    setIsTextDirty(false);
    setIsTextSaved(true);
    setTimeout(() => setIsTextSaved(false), 2000);
  };

  // Handle radio/dropdown option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    autoSave({ selectedOption: option });
  };

  // Handle single photo upload
  const handlePhotoUpload = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      autoSave({ photoUrl: url });
    }
  };

  const handlePhotoDelete = () => {
    setPhotoUrl('');
    autoSave({ photoUrl: null });
  };

  // Handle multiple photo uploads
  const handleMultiPhotoUpload = (files) => {
    if (files && files.length > 0) {
      const newUrls = Array.from(files).map(file => URL.createObjectURL(file));
      const updatedUrls = [...photoUrls, ...newUrls];
      setPhotoUrls(updatedUrls);
      autoSave({ photoUrls: updatedUrls });
    }
  };

  const handleMultiPhotoDelete = (index) => {
    const updatedUrls = photoUrls.filter((_, i) => i !== index);
    setPhotoUrls(updatedUrls);
    autoSave({ photoUrls: updatedUrls.length > 0 ? updatedUrls : null });
  };

  const handlePreview = (url) => {
    setPreviewImage(url);
    setShowPreview(true);
  };

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const handleCaptureClick = () => {
    captureInputRef.current?.click();
  };

  const handleMultiUploadClick = () => {
    multiUploadInputRef.current?.click();
  };

  const handleMultiCaptureClick = () => {
    multiCaptureInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handleMultiFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      handleMultiPhotoUpload(files);
    }
  };

  // Render input based on type
  const renderInput = () => {
    switch (inputType) {
      case 'text':
        return (
          <div className={styles.textInputWrapper}>
            <input
              type="text"
              value={textValue}
              onChange={handleTextChange}
              placeholder={item.label}
              className={styles.textInput}
            />
            {(isTextDirty || isTextSaved) && (
              <button
                type="button"
                onClick={handleTextSave}
                className={`${styles.inlineSaveButton} ${isTextSaved ? styles.saved : ''}`}
                disabled={isTextSaved}
                title={isTextSaved ? 'Saved' : 'Click to save'}
              >
                {isTextSaved ? <MdCheck /> : <MdSave />}
              </button>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className={styles.textInputWrapper}>
            <textarea
              value={textValue}
              onChange={handleTextareaChange}
              placeholder={item.label}
              className={styles.textareaInput}
              rows={4}
            />
            {(isTextDirty || isTextSaved) && (
              <button
                type="button"
                onClick={handleTextareaSave}
                className={`${styles.inlineSaveButton} ${isTextSaved ? styles.saved : ''}`}
                disabled={isTextSaved}
                title={isTextSaved ? 'Saved' : 'Click to save'}
              >
                {isTextSaved ? <MdCheck /> : <MdSave />}
              </button>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className={styles.optionsGrid}>
            {item.options?.map((option) => (
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
            {item.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'image':
        return (
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
                  <FiUpload /> Upload
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
              <div className={styles.previewRow}>
                <img
                  src={photoUrl}
                  alt="Uploaded"
                  className={styles.previewThumb}
                  onClick={() => handlePreview(photoUrl)}
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
        );

      case 'multi-image':
        return (
          <div className={styles.uploadSection}>
            <div className={styles.uploadButtons}>
              <input
                ref={multiUploadInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultiFileChange}
                className={styles.fileInput}
              />
              <input
                ref={multiCaptureInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleMultiFileChange}
                className={styles.fileInput}
              />
              <button
                type="button"
                onClick={handleMultiUploadClick}
                className={styles.uploadButton}
              >
                <FiUpload /> Upload Multiple
              </button>
              <button
                type="button"
                onClick={handleMultiCaptureClick}
                className={styles.captureButton}
              >
                <IoIosCamera />
              </button>
            </div>
            {photoUrls.length > 0 && (
              <div className={styles.multiImageGrid}>
                {photoUrls.map((url, index) => (
                  <div key={index} className={styles.previewRow}>
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className={styles.previewThumb}
                      onClick={() => handlePreview(url)}
                    />
                    <button
                      type="button"
                      onClick={() => handleMultiPhotoDelete(index)}
                      className={styles.deleteIconButton}
                      aria-label="Delete photo"
                    >
                      <MdDelete />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Determine if item is completed
  const isCompleted = () => {
    if (inputType === 'text' || inputType === 'textarea') {
      return textValue.trim() !== '';
    } else if (inputType === 'image') {
      return photoUrl !== '';
    } else if (inputType === 'multi-image') {
      return photoUrls.length > 0;
    } else {
      return selectedOption !== '';
    }
  };

  return (
    <>
      <div className={`${styles.card} ${isCompleted() ? styles.completed : styles.pending}`}>
        <div className={styles.header}>
          <span className={styles.label}>{item.label}</span>
        </div>

        <div className={styles.content}>
          {renderInput()}

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
        imageUrl={previewImage}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
};

export default ChecklistItem;
