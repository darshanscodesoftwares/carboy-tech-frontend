import { useState, useRef, useEffect, useCallback } from "react";
import ImagePreviewModal from "./ImagePreviewModal";
import styles from "./ChecklistItem.module.css";
import { MdDelete, MdCheck, MdSave } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { IoIosCamera } from "react-icons/io";
import axios from "../api/index";

const MEDIA_CONFIG = {
  image: {
    endpoint: "/uploads/image",
    accept: "image/*",
    field: "image",
  },
  audio: {
    endpoint: "/uploads/audio",
    accept: "audio/*",
    field: "audio",
  },
  video: {
    endpoint: "/uploads/video",
    accept: "video/*",
    field: "video",
  },
  document: {
    endpoint: "/uploads/document",
    accept: ".pdf,.doc,.docx",
    field: "document",
  },
};

const ChecklistItem = ({
  item,
  job,
  onSubmit,
  isSubmitting,
  existingAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState(
    existingAnswer?.selectedOption || ""
  );
  const [textValue, setTextValue] = useState(existingAnswer?.value || "");
  const [notes, setNotes] = useState(existingAnswer?.notes || "");
  const [photoUrl, setPhotoUrl] = useState(existingAnswer?.photoUrl || "");
  const [photoUrls, setPhotoUrls] = useState(existingAnswer?.photoUrls || []);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isTextDirty, setIsTextDirty] = useState(false);
  const [isTextSaved, setIsTextSaved] = useState(false);

  const uploadInputRef = useRef(null);
  const mediaUploadInputRef = useRef(null);
  const captureInputRef = useRef(null);
  const multiUploadInputRef = useRef(null);
  const multiCaptureInputRef = useRef(null);
  const imageDeletedRef = useRef(false);

  const AUTO_FILL_FIELDS = {
    customer_name: (job) => job?.customerSnapshot?.name,
    contact_number: (job) => job?.customerSnapshot?.phone,
    inspection_date: (job) => {
      const rawDate = job?.schedule?.date;
      if (!rawDate) return "";

      const d = new Date(rawDate);

      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    },

    car_make: (job) => job?.vehicleSnapshot?.brand,
    car_model: (job) => job?.vehicleSnapshot?.model,
    make_model_year: (job) => job?.vehicleSnapshot?.year,

    // already working ones (for consistency)
    technician_name: (job) =>
      job?.technicianSnapshot?.name || job?.technician?.name || "",
    location: (job) => job?.location?.address,
  };

  const inputType = item.inputType || "radio";
  // const uploadImageAndGetUrl = async (file) => {
  //   const formData = new FormData();
  //   formData.append("image", file);

  //   const res = await axios.post("/uploads/image", formData, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });

  //   return res.data.url; // MUST return public URL
  // };

  const uploadFileAndGetUrl = async (file, forcedType = null) => {
    const type = forcedType || inputType;
    const config = MEDIA_CONFIG[type];
    if (!config) throw new Error("Unsupported media type");

    const formData = new FormData();
    formData.append(config.field, file);

    const res = await axios.post(config.endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url;
  };

  // =========================
  // AUTO SAVE (FIXED PAYLOAD)
  // =========================
  const autoSave = useCallback(
    (updates = {}) => {
      const payload = {
        checkpointKey: item.key,
        selectedOption: updates.selectedOption ?? selectedOption ?? null,
        value: updates.value ?? textValue ?? null,
        notes: updates.notes ?? notes ?? null,
        photoUrl: updates.photoUrl ?? photoUrl ?? null,
        photoUrls: updates.photoUrls ?? (photoUrls.length ? photoUrls : null),
      };
      onSubmit(payload);
    },
    [item.key, selectedOption, textValue, notes, photoUrl, photoUrls, onSubmit]
  );

  useEffect(() => {
    const autoFillFn = AUTO_FILL_FIELDS[item.key];
    if (!autoFillFn) return;

    // If backend already has value, don’t override
    if (existingAnswer?.value) return;

    const value = autoFillFn(job);
    if (!value) return;

    setTextValue(value);

    onSubmit({
      checkpointKey: item.key,
      value,
      selectedOption: null,
      notes: null,
      photoUrl: null,
      photoUrls: null,
    });
  }, [item.key, job, existingAnswer, onSubmit]);

  // =========================
  // REHYDRATE FROM BACKEND
  // =========================
  useEffect(() => {
    if (!existingAnswer) return;
    if (imageDeletedRef.current) return;
    setSelectedOption(existingAnswer.selectedOption || "");
    setTextValue(existingAnswer.value || "");
    setNotes(existingAnswer.notes || "");
    setPhotoUrl(existingAnswer.photoUrl || "");
    setPhotoUrls(existingAnswer.photoUrls || []);
  }, [existingAnswer]);

  // =========================
  // AUTO-SELECT SINGLE DROPDOWN
  // =========================
  useEffect(() => {
    if (
      (inputType === "dropdown" || inputType === "select") &&
      item.options?.length === 1 &&
      !selectedOption
    ) {
      const value = item.options[0];
      setSelectedOption(value);
      autoSave({ selectedOption: value });
    }
  }, [inputType, item.options, selectedOption, autoSave]);

  // =========================
  // TEXT HANDLERS
  // =========================
  const handleTextChange = (e) => {
    setTextValue(e.target.value ?? "");
    setIsTextDirty(true);
    setIsTextSaved(false);
  };

  const handleTextSave = () => {
    autoSave({ value: textValue });
    setIsTextDirty(false);
    setIsTextSaved(true);
    setTimeout(() => setIsTextSaved(false), 1500);
  };

  // =========================
  // OPTION HANDLER
  // =========================
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    autoSave({ selectedOption: option });
  };

  // =========================
  // IMAGE HANDLERS
  // =========================
  // const handlePhotoUpload = async (file) => {
  //   if (!file) return;

  //   const imageUrl = await uploadImageAndGetUrl(file);

  //   setPhotoUrl(imageUrl);
  //   autoSave({ photoUrl: imageUrl });
  // };

  const handleSingleFileUpload = async (file, forcedType = null) => {
    if (!file) return;

    const fileUrl = await uploadFileAndGetUrl(file, forcedType);
    setPhotoUrl(fileUrl);
    autoSave({ photoUrl: fileUrl });
  };

  const handlePhotoDelete = () => {
    imageDeletedRef.current = true;
    setPhotoUrl("");
    autoSave({ photoUrl: null });
  };

  const handleMultiPhotoUpload = async (files) => {
    if (!files?.length) return;

    const fileArray = Array.from(files);
    const uploadedUrls = await Promise.all(
      fileArray.map((file) => uploadFileAndGetUrl(file, "image"))
    );

    const updated = [...photoUrls, ...uploadedUrls];
    setPhotoUrls(updated);
    autoSave({ photoUrls: updated });
  };

  const handleMultiPhotoDelete = (index) => {
    imageDeletedRef.current = true;
    const updated = photoUrls.filter((_, i) => i !== index);
    setPhotoUrls(updated);
    autoSave({ photoUrls: updated.length ? updated : null });
  };

  // =========================
  // RENDER INPUT
  // =========================
  const renderInput = () => {
    const safeText = textValue ?? "";

    switch (inputType) {
      case "text":
      case "textarea":
        return (
          <div className={styles.textInputWrapper}>
            {inputType === "text" ? (
              <input
                type="text"
                value={safeText}
                readOnly={!!AUTO_FILL_FIELDS[item.key]}
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
                className={`${styles.inlineSaveButton} ${
                  isTextSaved ? styles.saved : ""
                }`}
              >
                {isTextSaved ? <MdCheck /> : <MdSave />}
              </button>
            )}
          </div>
        );

      case "radio":
      case "select":
        return (
          <div className={styles.optionsGrid}>
            {item.options?.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`${styles.optionButton} ${
                  selectedOption === option ? styles.selected : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case "dropdown":
        return (
          <select
            value={selectedOption}
            onChange={(e) => handleOptionSelect(e.target.value)}
            className={styles.dropdownInput}
          >
            <option value="">-- Select --</option>
            {item.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "image":
        return (
          <div className={styles.uploadSection}>
            {!photoUrl ? (
              <div className={styles.uploadButtons}>
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleSingleFileUpload(e.target.files[0], "image")
                  }
                  className={styles.fileInput}
                />

                <input
                  ref={captureInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) =>
                    handleSingleFileUpload(e.target.files[0], "image")
                  }
                  className={styles.fileInput}
                />

                <button
                  onClick={() => uploadInputRef.current.click()}
                  className={styles.uploadButton}
                >
                  <FiUpload /> Upload Img
                </button>

                <button
                  onClick={() => captureInputRef.current.click()}
                  className={styles.captureButton}
                >
                  <IoIosCamera />
                </button>
              </div>
            ) : (
              <div className={styles.previewRow}>
                <img
                  src={photoUrl}
                  alt="Preview"
                  className={styles.previewThumb}
                  onClick={() => {
                    setPreviewImage(photoUrl);
                    setShowPreview(true);
                  }}
                />
                <button
                  onClick={handlePhotoDelete}
                  className={styles.deleteIconButton}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        );

      case "audio":
      case "video":
      case "document":
        return (
          <div className={styles.uploadSection}>
            {!photoUrl ? (
              <>
                <input
                  ref={mediaUploadInputRef}
                  type="file"
                  accept={MEDIA_CONFIG[inputType].accept}
                  onChange={(e) => handleSingleFileUpload(e.target.files[0])}
                  className={styles.fileInput}
                />
                <button
                  onClick={() => mediaUploadInputRef.current.click()}
                  className={styles.uploadButton}
                >
                  <FiUpload /> Upload {inputType}
                </button>
              </>
            ) : (
              <div className={styles.previewRow}>
                <a href={photoUrl} target="_blank" rel="noopener noreferrer">
                  View uploaded {inputType}
                </a>
                <button
                  onClick={handlePhotoDelete}
                  className={styles.deleteIconButton}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        );

      case "multi-image":
        return (
          <div className={styles.uploadSection}>
            <div className={styles.uploadButtons}>
              <input
                ref={multiUploadInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleMultiPhotoUpload(e.target.files)}
                className={styles.fileInput}
              />
              <input
                ref={multiCaptureInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={(e) => handleMultiPhotoUpload(e.target.files)}
                className={styles.fileInput}
              />
              <button
                onClick={() => multiUploadInputRef.current.click()}
                className={styles.uploadButton}
              >
                <FiUpload /> Upload Multiple
              </button>
              <button
                onClick={() => multiCaptureInputRef.current.click()}
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
                      onClick={() => {
                        setPreviewImage(url);
                        setShowPreview(true);
                      }}
                    />
                    <button
                      onClick={() => handleMultiPhotoDelete(index)}
                      className={styles.deleteIconButton}
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

  const isCompleted = () => {
    if (["image", "audio", "video", "document"].includes(inputType)) {
      return !!photoUrl;
    }

    if (inputType === "multi-image") {
      return photoUrls.length > 0;
    }

    if (inputType === "text" || inputType === "textarea") {
      const value = typeof textValue === "string" ? textValue : "";
      return value.length > 0;
    }

    return selectedOption !== "";
  };

  const safeText = () => textValue ?? "";

  return (
    <>
      <div
        className={`${styles.card}
    ${isCompleted() ? styles.completed : styles.pending}
    ${item.optional ? styles.optionalCard : ""}
  `}
      >
        <div className={styles.header}>
          <span className={styles.label}>
            {item.label}

            {item.optional === true && (
              <span className={styles.optionalBadge}>Optional</span>
            )}
          </span>
        </div>

        <div className={styles.content}>{renderInput()}</div>
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
