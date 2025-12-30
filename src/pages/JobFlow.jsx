import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useJobFlow, { JOB_STATUSES, getStepIndex } from '../hooks/useJobFlow';
import useJobNotifications from '../hooks/useJobNotifications';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobDetailsView from '../components/JobDetailsView';
import TravelProgressView from '../components/TravelProgressView';
import ProgressBar from '../components/ProgressBar';
import ChecklistItem from '../components/ChecklistItem';
import InspectionSummary from '../components/InspectionSummary';
import FloatingRemarksButton from '../components/FloatingRemarksButton';
import RemarksModal from '../components/RemarksModal';
import Toast from '../components/Toast';
import Loading from '../components/Loading';
import styles from './JobFlow.module.css';

const JobFlow = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const {
    job,
    checklist,
    summary,
    loading,
    error,
    setError,
    fetchJob,
    startTravel,
    reachedLocation,
    startInspection,
    fetchChecklist,
    submitCheckpoint,
    completeJob,
    fetchSummary
  } = useJobFlow();

  const [actionLoading, setActionLoading] = useState(false);
  const [checkpointLoading, setCheckpointLoading] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [showRemarksModal, setShowRemarksModal] = useState(false);

  const isInspectionOrSummary =
    job?.status === JOB_STATUSES.IN_INSPECTION ||
    job?.status === JOB_STATUSES.COMPLETED ||
    summary;

  const { showNotification, dismissNotification } =
    useJobNotifications(isInspectionOrSummary);

  useEffect(() => {
    if (jobId) fetchJob(jobId);
  }, [jobId, fetchJob]);

  useEffect(() => {
    if (job?.status === JOB_STATUSES.IN_INSPECTION && !checklist) {
      fetchChecklist(jobId);
    }
  }, [job?.status, checklist, jobId, fetchChecklist]);

  const handleAction = async (action) => {
    setActionLoading(true);
    setError(null);
    try {
      await action();
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckpointSubmit = async (checkpoint) => {
    setCheckpointLoading(true);
    try {
      await submitCheckpoint(jobId, checkpoint);
    } finally {
      setCheckpointLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    setActionLoading(true);
    try {
      const report = {
        summary: 'Inspection completed successfully',
        overallStatus: 'PASS',
        remarks: remarks.trim() || null,
        recommendations: []
      };

      await completeJob(jobId, report);
      await fetchSummary(jobId);
    } finally {
      setActionLoading(false);
    }
  };

  const getExistingAnswer = (key) =>
    job?.checklistAnswers?.find((a) => a.checkpointKey === key);

  const allCheckpointsCompleted = () => {
    if (!checklist) return false;

    if (checklist.sections) {
      const items = checklist.sections.flatMap((s) => s.items);
      return items.every((item) =>
        job?.checklistAnswers?.some((a) => a.checkpointKey === item.key)
      );
    }

    if (checklist.items) {
      return checklist.items.every((item) =>
        job?.checklistAnswers?.some((a) => a.checkpointKey === item.key)
      );
    }

    return false;
  };

  const renderActionButton = () => {
    if (!job) return null;

    const config = {
      [JOB_STATUSES.ACCEPTED]: {
        label: 'Start Travel',
        action: () => startTravel(jobId)
      },
      [JOB_STATUSES.REACHED]: {
        label: 'Start Inspection',
        action: () => startInspection(jobId)
      }
    };

    const btn = config[job.status];
    if (!btn) return null;

    return (
      <button
        onClick={() => handleAction(btn.action)}
        disabled={actionLoading}
        className={styles.primaryButton}
      >
        {actionLoading ? (
          <>
            <div className={styles.spinner} />
            Processing...
          </>
        ) : (
          btn.label
        )}
      </button>
    );
  };

  if (loading && !job) {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <Loading message="Loading job..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (!job && error) {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.error}>
            <p>{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className={styles.primaryButton}
            >
              Back to Dashboard
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (job?.status === JOB_STATUSES.TRAVELING) {
    return (
      <TravelProgressView
        currentStep={1}
        onReachedLocation={() =>
          handleAction(() => reachedLocation(jobId))
        }
      />
    );
  }

  if (job?.status === JOB_STATUSES.ACCEPTED) {
    return (
      <JobDetailsView
        job={job}
        onStartTravel={() => handleAction(() => startTravel(jobId))}
      />
    );
  }

  if (job?.status === JOB_STATUSES.COMPLETED || summary) {
    return <InspectionSummary job={summary?.job || job} />;
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        {job?.status !== JOB_STATUSES.PENDING && (
          <div className={styles.progressCard}>
            <ProgressBar currentStep={getStepIndex(job?.status)} />
          </div>
        )}

        <div className={styles.checklistSection}>
          <h3 className={styles.checklistTitle}>Inspection Checklist</h3>

          {checklist?.sections?.map((section) => (
            <div key={section.section} className={styles.sectionGroup}>
              <h4 className={styles.sectionHeader}>{section.section}</h4>
              {section.items.map((item) => (
                <ChecklistItem
                  key={item.key}
                  item={item}
                  onSubmit={handleCheckpointSubmit}
                  isSubmitting={checkpointLoading}
                  existingAnswer={getExistingAnswer(item.key)}
                />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.actionButtons}>
          <button
            onClick={handleSubmitReport}
            disabled={actionLoading || !allCheckpointsCompleted()}
            className={styles.primaryButton}
          >
            {actionLoading ? (
              <>
                <div className={styles.spinner} />
                Submitting Report...
              </>
            ) : (
              'Submit Report'
            )}
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className={styles.secondaryButton}
          >
            Back to Dashboard
          </button>
        </div>
      </main>

      <Footer />

      {job?.status === JOB_STATUSES.IN_INSPECTION && (
        <FloatingRemarksButton
          onClick={() => setShowRemarksModal(true)}
          hasRemark={!!remarks}
        />
      )}

      <RemarksModal
        isOpen={showRemarksModal}
        onClose={() => setShowRemarksModal(false)}
        onSubmit={setRemarks}
        initialRemark={remarks}
      />

      {showNotification && (
        <Toast
          message="A new service job has been assigned to you."
          onClose={dismissNotification}
        />
      )}
    </div>
  );
};

export default JobFlow;
