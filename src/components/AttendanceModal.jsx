import { useRef, useState, useEffect, useCallback } from "react";
import { markAttendance } from "../api/attendance";
import styles from "./AttendanceModal.module.css";

const AttendanceModal = ({ onClose, onSuccess }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [captured, setCaptured] = useState(null); // base64 preview
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setCameraError("Camera unavailable. Please allow camera access and try again.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      setCapturedBlob(blob);
      setCaptured(canvas.toDataURL("image/jpeg"));
    }, "image/jpeg", 0.9);
  };

  const handleRetake = () => {
    setCaptured(null);
    setCapturedBlob(null);
    setError(null);
    startCamera();
  };

  const handleSubmit = async () => {
    if (!capturedBlob) return;
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("selfie", capturedBlob, "selfie.jpg");
      await markAttendance(formData);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Mark Attendance</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {cameraError ? (
          <p className={styles.cameraError}>{cameraError}</p>
        ) : (
          <>
            {!captured ? (
              <div className={styles.cameraWrapper}>
                <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
                <button className={styles.captureBtn} onClick={handleCapture}>Take Selfie</button>
              </div>
            ) : (
              <div className={styles.previewWrapper}>
                <img src={captured} alt="Selfie preview" className={styles.preview} />
                <div className={styles.previewActions}>
                  <button className={styles.retakeBtn} onClick={handleRetake} disabled={submitting}>Retake</button>
                  <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {error && <p className={styles.error}>{error}</p>}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default AttendanceModal;
