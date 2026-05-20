import { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import api from "../api/index";
import styles from "./AttendanceModal.module.css";

const InspectionSelfieCapture = ({ jobId, onSuccess }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [captured, setCaptured] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async () => {
    setCameraError(null);
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
      streamRef.current?.getTracks().forEach((t) => t.stop());
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
      // Jobs route is at /api/jobs, not /api/technician/jobs — strip the technician prefix
      const jobsBase = api.defaults.baseURL.replace(/\/technician$/, "");
      const token = localStorage.getItem("token");
      await axios.post(`${jobsBase}/jobs/${jobId}/selfie`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
      <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 14, color: "#374151" }}>
        📷 Take a selfie at the vehicle before starting inspection
      </p>

      {cameraError ? (
        <p style={{ color: "#DC2626", fontSize: 13 }}>{cameraError}</p>
      ) : (
        <>
          {!captured ? (
            <div className={styles.cameraWrapper}>
              <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
              <button className={styles.captureBtn} onClick={handleCapture}>
                Take Selfie
              </button>
            </div>
          ) : (
            <div className={styles.previewWrapper}>
              <img src={captured} alt="Selfie preview" className={styles.preview} />
              <div className={styles.previewActions}>
                <button className={styles.retakeBtn} onClick={handleRetake} disabled={submitting}>
                  Retake
                </button>
                <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Selfie"}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {error && <p style={{ color: "#DC2626", fontSize: 13, marginTop: 8 }}>{error}</p>}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default InspectionSelfieCapture;
