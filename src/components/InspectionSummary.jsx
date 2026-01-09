import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reopenJob, sendReport } from '../api/jobs';
import ProgressBar from './ProgressBar';
import styles from './InspectionSummary.module.css';

const InspectionSummary = ({ job }) => {
  const navigate = useNavigate();
  const [isReopening, setIsReopening] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!job) return null;

  const handleEditReport = async () => {
    try {
      setIsReopening(true);
      await reopenJob(job._id);
      navigate(`/flow/${job._id}?edit=true`);
    } catch (error) {
      console.error('Failed to reopen job:', error);
      alert('Failed to reopen inspection. Please try again.');
    } finally {
      setIsReopening(false);
    }
  };

  const handleSendReport = async () => {
    try {
      setIsSending(true);
      await sendReport(job._id);
    } catch (error) {
      console.warn('Send report API not yet implemented:', error);
    } finally {
      setIsSending(false);
      navigate('/dashboard');
    }
  };

  const isReportSent = job?.status === 'report_sent';

  const summaryData = [
    { label: 'Customer', value: job.customerSnapshot?.name || 'N/A' },
    {
      label: 'Vehicle',
      value: `${job.vehicleSnapshot?.year || ''} ${job.vehicleSnapshot?.brand || ''} ${job.vehicleSnapshot?.model || ''}`.trim() || 'N/A'
    },
    { label: 'Location', value: job.location?.address || 'N/A' },
    { label: 'Service Type', value: job.serviceType || 'N/A' },
    { label: 'Completion Date', value: job.schedule?.date || 'N/A' }
  ];

  const answers =
    job?.inspectionReport?.checklistAnswers ||
    job?.report?.checklistAnswers ||
    [];

  const getMediaType = (url) => {
    if (!url) return null;
    const lower = url.toLowerCase();
    if (lower.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/)) return 'image';
    if (lower.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/)) return 'audio';
    if (lower.match(/\.(mp4|webm|ogv|mov|avi|mkv)$/)) return 'video';
    if (lower.match(/\.(pdf|doc|docx|txt)$/)) return 'document';
    if (lower.includes('/image')) return 'image';
    if (lower.includes('/audio')) return 'audio';
    if (lower.includes('/video')) return 'video';
    if (lower.includes('/document')) return 'document';
    return 'image';
  };

  const renderMedia = (url, label) => {
    const mediaType = getMediaType(url);

    switch (mediaType) {
      case 'image':
        return (
          <div className={styles.answerPhoto}>
            <img
              src={url}
              alt={label}
              className={styles.photoThumb}
            />
          </div>
        );

      case 'audio':
        return (
          <div className={styles.answerPhoto}>
            <audio src={url} controls style={{ width: '100%', maxWidth: '400px' }} />
          </div>
        );

      case 'video':
        return (
          <div className={styles.answerPhoto}>
            <video src={url} controls style={{ width: '100%', maxWidth: '400px', maxHeight: '300px' }} />
          </div>
        );

      case 'document':
        return (
          <div className={styles.answerPhoto}>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#347b65', textDecoration: 'underline' }}>
              📄 View Document
            </a>
          </div>
        );

      default:
        return null;
    }
  };

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
                  {answer.checkpointKey}
                </p>

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

                {answer.notes && (
                  <p className={styles.answerNotes}>
                    <strong>Notes:</strong> {answer.notes}
                  </p>
                )}

                {answer.photoUrl && renderMedia(answer.photoUrl, answer.checkpointKey)}

                {Array.isArray(answer.photoUrls) && answer.photoUrls.length > 0 && (
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
          title={isReportSent ? 'Report has been sent and cannot be edited' : ''}
        >
          {isReopening ? 'Opening…' : 'Edit Report'}
        </button>

        <button
          className={styles.primaryButton}
          onClick={handleSendReport}
          disabled={isSending || isReportSent}
        >
          {isSending ? 'Sending Report...' : isReportSent ? 'Report Sent - Back to Dashboard' : 'Send Report & Return to Dashboard'}
        </button>
      </div>

      <p className={styles.footerText}>
        Thank you for your thorough inspection work!
      </p>
    </div>
  );
};

export default InspectionSummary;
