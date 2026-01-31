import { useState } from "react";
import ProgressBar from "./ProgressBar";
import styles from "./InspectionSummary.module.css";
import { useNavigate } from "react-router-dom";

const InspectionSummary = ({ job, onEditReport, onSendReport }) => {
  const [isReopening, setIsReopening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  if (!job) return null;

  const handleEditReport = async () => {
    console.log("🔵 [InspectionSummary] Edit Report button clicked");
    try {
      setIsReopening(true);

      // ✅ 1. call parent logic (backend mutation)
      console.log("🔵 [InspectionSummary] Calling onEditReport callback...");
      await onEditReport(job._id);
      console.log("🔵 [InspectionSummary] onEditReport callback completed");

      // ✅ 2. navigate AFTER success
      console.log("🔵 [InspectionSummary] Calling navigate...");
      navigate(`/flow/${job._id}?edit=true`);
      console.log("🔵 [InspectionSummary] navigate called");
    } catch (error) {
      console.error("❌ [InspectionSummary] Failed to reopen job:", error);
      alert("Failed to reopen inspection. Please try again.");
    } finally {
      setIsReopening(false);
    }
  };

  const handleSendReport = async () => {
    console.log("🟢 [InspectionSummary] Send Report button clicked");
    try {
      setIsSending(true);

      // ✅ 1. call parent logic (backend mutation)
      console.log("🟢 [InspectionSummary] Calling onSendReport callback...");
      await onSendReport(job._id);
      console.log("🟢 [InspectionSummary] onSendReport callback completed");

      // ✅ 2. navigate AFTER success
      console.log("🟢 [InspectionSummary] Calling navigate...");
      navigate("/dashboard");
      console.log("🟢 [InspectionSummary] navigate called");
    } catch (error) {
      console.error("❌ [InspectionSummary] Failed to send report:", error);
      alert("Failed to send report. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const isReportSent = job?.status === "report_sent";

  const summaryData = [
    { label: "Customer", value: job.customerSnapshot?.name || "N/A" },
    {
      label: "Vehicle",
      value:
        `${job.vehicleSnapshot?.year || ""} ${
          job.vehicleSnapshot?.brand || ""
        } ${job.vehicleSnapshot?.model || ""}`.trim() || "N/A",
    },
    { label: "Location", value: job.location?.address || "N/A" },
    { label: "Service Type", value: job.serviceType || "N/A" },
    { label: "Completion Date", value: job.schedule?.date || "N/A" },
  ];

  const answers =
    job?.inspectionReport?.checklistAnswers ||
    job?.report?.checklistAnswers ||
    [];

  return (
    <div className={styles.container}>
      <div className={styles.progressCard}>
        <ProgressBar currentStep={4} />
      </div>

      <div className={styles.successBanner}>
        <h1 className={styles.successTitle}>Inspection Completed!</h1>
        <p className={styles.successDescription}>
          Used car inspection has been successfully completed and submitted.
        </p>
      </div>

      <div className={styles.summarySection}>
        <h2 className={styles.sectionTitle}>Job Summary</h2>
        <div className={styles.summaryGrid}>
          {summaryData.map((item, index) => (
            <div key={index} className={styles.summaryCard}>
              <p className={styles.cardLabel}>{item.label}</p>
              <p className={styles.cardValue}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 CHECKPOINT ANSWERS (DEDUPED SOURCE) */}
      {Array.isArray(answers) && answers.length > 0 && (
        <div className={styles.reportBlock}>
          <h3 className={styles.reportTitle}>
            Inspection Report ({answers.length} items)
          </h3>

          <div className={styles.answersList}>
            {answers.map((answer, index) => (
              <div
                key={`${answer.checkpointKey}-${index}`}
                className={styles.answerItem}
              >
                <p className={styles.answerLabel}>
                  {answer.checkpointKey.replace(/_/g, " ")}
                </p>

                {/* TEXT / SELECT */}
                {answer.selectedOption && (
                  <p className={styles.answerValue}>
                    <strong>Response:</strong> {answer.selectedOption}
                  </p>
                )}

                {answer.value && (
                  <p className={styles.answerValue}>
                    <strong>Value:</strong> {answer.value}
                  </p>
                )}

                {/* SINGLE IMAGE */}
                {answer.photoUrl && (
                  <div className={styles.answerPhoto}>
                    <img
                      src={answer.photoUrl}
                      alt={answer.checkpointKey}
                      className={styles.photoThumb}
                    />
                  </div>
                )}

                {/* MULTI IMAGE */}
                {Array.isArray(answer.photoUrls) &&
                  answer.photoUrls.length > 0 && (
                    <div className={styles.answerPhotos}>
                      {answer.photoUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`${answer.checkpointKey}-${idx}`}
                          className={styles.photoThumb}
                        />
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.buttonContainer}>
        <button
          className={styles.secondaryButton}
          onClick={handleEditReport}
          disabled={isReopening || isReportSent}
        >
          {isReopening ? "Opening…" : "Edit Report"}
        </button>

        <button
          className={styles.primaryButton}
          onClick={handleSendReport}
          disabled={isSending || isReportSent}
        >
          {isSending
            ? "Sending Report..."
            : "Send Report & Return to Dashboard"}
        </button>
      </div>

      <p className={styles.footerText}>
        Thank you for your thorough inspection work!
      </p>
    </div>
  );
};

export default InspectionSummary;
