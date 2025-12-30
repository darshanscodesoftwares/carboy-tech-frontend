import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isEditMode = searchParams.get('edit') === 'true';

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
    const shouldFetchChecklist =
      job?.status === JOB_STATUSES.IN_INSPECTION ||
      (isEditMode && job?.status === JOB_STATUSES.COMPLETED);

    if (shouldFetchChecklist && !checklist) {
      fetchChecklist(jobId);
    }
  }, [job?.status, checklist, jobId, isEditMode, fetchChecklist]);

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
      await completeJob(jobId, {
        summary: 'Inspection completed successfully',
        overallStatus: 'PASS',
        remarks: remarks.trim() || null,
        recommendations: []
      });
      await fetchSummary(jobId);
      navigate(`/flow/${jobId}`);
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
      return items.every((i) =>
        job?.checklistAnswers?.some((a) => a.checkpointKey === i.key)
      );
    }

    if (checklist.items) {
      return checklist.items.every((i) =>
        job?.checklistAnswers?.some((a) => a.checkpointKey === i.key)
      );
    }

    return false;
  };

  const renderSummary = () =>
    summary ? <InspectionSummary job={summary.job || job} /> : null;

  const renderContent = () => {
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

    // ✅ FIXED SUMMARY CONDITION
    if (
      !isEditMode &&
      job?.status === JOB_STATUSES.COMPLETED &&
      summary
    ) {
      return renderSummary();
    }

    return (
      <>
        <div className={styles.checklistSection}>
          {checklist?.sections?.map((section) => (
            <div key={section.section}>
              <h4>{section.section}</h4>
              {section.items.map((item) => (
                <ChecklistItem
                  key={item.key}
                  item={item}
                  onSubmit={handleCheckpointSubmit}
                  isSubmitting={checkpointLoading}
                  existingAnswer={getExistingAnswer(item.key)}
                  isEditMode={isEditMode}
                />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.actionButtons}>
          {(job?.status === JOB_STATUSES.IN_INSPECTION ||
            (isEditMode && job?.status === JOB_STATUSES.COMPLETED)) && (
            <button
              onClick={handleSubmitReport}
              disabled={!allCheckpointsCompleted() || actionLoading}
              className={styles.primaryButton}
            >
              Submit Report
            </button>
          )}

          <button
            onClick={() => navigate('/dashboard')}
            className={styles.secondaryButton}
          >
            Back to Dashboard
          </button>
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>{renderContent()}</main>
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
          message="A new service job has been assigned."
          onClose={dismissNotification}
        />
      )}
    </div>
  );
};

export default JobFlow;
