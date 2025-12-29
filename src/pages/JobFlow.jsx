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
  const { job, checklist, summary, loading, error, setError, fetchJob, startTravel, reachedLocation, startInspection, fetchChecklist, submitCheckpoint, completeJob, fetchSummary } = useJobFlow();
  const [actionLoading, setActionLoading] = useState(false);
  const [checkpointLoading, setCheckpointLoading] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [showRemarksModal, setShowRemarksModal] = useState(false);

  // Enable job notifications only on inspection and summary pages
  const isInspectionOrSummary = job?.status === JOB_STATUSES.IN_INSPECTION || job?.status === JOB_STATUSES.COMPLETED || summary;
  const { showNotification, dismissNotification } = useJobNotifications(isInspectionOrSummary);

  useEffect(() => { if (jobId) fetchJob(jobId); }, [jobId, fetchJob]);
  useEffect(() => {
    // Fetch checklist when in inspection mode OR when in edit mode (completed)
    const shouldFetchChecklist = (job?.status === JOB_STATUSES.IN_INSPECTION) ||
                                  (isEditMode && job?.status === JOB_STATUSES.COMPLETED);
    if (shouldFetchChecklist && !checklist) {
      fetchChecklist(jobId);
    }
  }, [job?.status, checklist, jobId, isEditMode, fetchChecklist]);

  const handleAction = async (action) => { setActionLoading(true); setError(null); try { await action(); } catch { } finally { setActionLoading(false); } };
  const handleCheckpointSubmit = async (checkpoint) => { setCheckpointLoading(true); try { await submitCheckpoint(jobId, checkpoint); } catch { } finally { setCheckpointLoading(false); } };

  // Manual submit report
  const handleSubmitReport = async () => {
    setActionLoading(true);
    try {
      const reportWithRemarks = {
        summary: 'Inspection completed successfully',
        overallStatus: 'PASS',
        remarks: remarks.trim() || null,
        recommendations: []
      };
      await completeJob(jobId, reportWithRemarks);
      await fetchSummary(jobId);
    } catch { }
    finally {
      setActionLoading(false);
    }
  };
  const handleSaveRemark = (remark) => {
    setRemarks(remark);
  };
  const getExistingAnswer = (key) => job?.checklistAnswers?.find((a) => a.checkpointKey === key);

  // Handle both PDI (sections-based) and UCI (flat items)
  const allCheckpointsCompleted = () => {
    if (!checklist) return false;

    // PDI format with sections
    if (checklist.sections) {
      const allItems = checklist.sections.flatMap(section => section.items);
      return allItems.length > 0 && allItems.every((item) => job?.checklistAnswers?.some((a) => a.checkpointKey === item.key));
    }

    // UCI format with flat items
    if (checklist.items) {
      return checklist.items.every((item) => job?.checklistAnswers?.some((a) => a.checkpointKey === item.key));
    }

    return false;
  };

  const renderActionButton = () => {
    if (!job) return null;
    // Don't show Accept button anymore - accepting happens from Dashboard
    const config = { [JOB_STATUSES.ACCEPTED]: { label: 'Start Travel', action: () => startTravel(jobId) }, [JOB_STATUSES.REACHED]: { label: 'Start Inspection', action: () => startInspection(jobId) } };
    const btn = config[job.status]; if (!btn) return null;
  
    return <button onClick={() => handleAction(btn.action)} disabled={actionLoading} className={styles.primaryButton}>{actionLoading ? <><div className={styles.spinner} />Processing...</> : btn.label}</button>;
  };

  const renderSummary = () => {
    if (!summary) return <div className={styles.emptyChecklist}><button onClick={() => fetchSummary(jobId)} disabled={loading} className={styles.primaryButton}>{loading ? 'Loading...' : 'View Summary'}</button></div>;
    return <InspectionSummary job={summary.job || job} />;
  };

  if (loading && !job) return <div className={styles.container}><Navbar /><main className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loading message="Loading job..." /></main><Footer /></div>;
  if (!job && error) return <div className={styles.container}><Navbar /><main className={styles.main}><div className={styles.error}><p>{error}</p><button onClick={() => navigate('/dashboard')} className={styles.primaryButton} style={{ marginTop: 'var(--space-md)' }}>Back to Dashboard</button></div></main><Footer /></div>;

  const renderContent = () => {
    // Flow 3: Travel Progress View (when traveling)
    if (job?.status === JOB_STATUSES.TRAVELING) {
      return (
        <TravelProgressView
          currentStep={1}
          onReachedLocation={() => handleAction(() => reachedLocation(jobId))}
        />
      );
    }

    // Flow 2: Job Details View (when accepted, not yet traveling)
    if (job?.status === JOB_STATUSES.ACCEPTED) {
      return (
        <JobDetailsView
          job={job}
          onStartTravel={() => handleAction(() => startTravel(jobId))}
        />
      );
    }

    // Completed Summary View (skip in edit mode)
    if (!isEditMode && (job?.status === JOB_STATUSES.COMPLETED || summary)) {
      return renderSummary();
    }

    // Default view for other statuses (pending, reached, in_inspection)
    return (
      <>
        {error && <div className={styles.error}>{error}</div>}
        {job?.status !== JOB_STATUSES.COMPLETED && job?.status !== JOB_STATUSES.PENDING && (
          <div className={styles.progressCard}><ProgressBar currentStep={getStepIndex(job?.status)} /></div>
        )}

        <div className={styles.jobCard}>
          <div className={styles.jobHeader}><span className={styles.serviceType}>{job?.serviceType}</span><span className={styles.statusBadge}>{job?.status?.replace('_', ' ')}</span></div>
          <div className={styles.section}><h3 className={styles.sectionTitle}>Customer</h3><p className={styles.sectionContent}>{job?.customerSnapshot?.name}</p><p className={styles.sectionText}>{job?.customerSnapshot?.phone}</p></div>
          <div className={styles.section}><h3 className={styles.sectionTitle}>Vehicle</h3><p className={styles.sectionContent}>{job?.vehicleSnapshot?.brand} {job?.vehicleSnapshot?.model}</p><p className={styles.sectionText}>{job?.vehicleSnapshot?.year}</p></div>
          <div className={styles.section}><h3 className={styles.sectionTitle}>Location</h3><p className={styles.sectionText}>{job?.location?.address}</p></div>
          <div className={styles.schedule}><span className={styles.scheduleDate}>{job?.schedule?.date}</span><span className={styles.scheduleSlot}>{job?.schedule?.slot}</span></div>
        </div>

        {(job?.status === JOB_STATUSES.IN_INSPECTION || (isEditMode && job?.status === JOB_STATUSES.COMPLETED)) && (
          <div className={styles.checklistSection}>
            <h3 className={styles.checklistTitle}>Inspection Checklist</h3>
            {loading && !checklist ? (
              <Loading message="Loading checklist..." />
            ) : checklist ? (
              <>
                {/* PDI format with sections */}
                {checklist.sections && checklist.sections.map((section) => (
                  <div key={section.section} className={styles.sectionGroup}>
                    <h4 className={styles.sectionHeader}>{section.section}</h4>
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

                {/* UCI format with flat items */}
                {checklist.items && !checklist.sections && checklist.items.map((item) => (
                  <ChecklistItem
                    key={item.key}
                    item={item}
                    onSubmit={handleCheckpointSubmit}
                    isSubmitting={checkpointLoading}
                    existingAnswer={getExistingAnswer(item.key)}
                    isEditMode={isEditMode}
                  />
                ))}
              </>
            ) : (
              <p className={styles.emptyChecklist}>No checklist available</p>
            )}
          </div>
        )}

        <div className={styles.actionButtons}>
          {/* Primary action button for all states */}
          {(job?.status === JOB_STATUSES.IN_INSPECTION || (isEditMode && job?.status === JOB_STATUSES.COMPLETED)) ? (
            <button
              onClick={handleSubmitReport}
              disabled={actionLoading || !allCheckpointsCompleted()}
              className={styles.primaryButton}
              title={!allCheckpointsCompleted() ? 'Please complete all checkpoints before submitting' : ''}
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
          ) : (
            renderActionButton()
          )}

          {/* Secondary action - always present */}
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
      <main className={styles.main}>
        {renderContent()}
      </main>
      <Footer />

      {/* Floating Remarks Button - Show only during inspection */}
      {job?.status === JOB_STATUSES.IN_INSPECTION && (
        <FloatingRemarksButton
          onClick={() => setShowRemarksModal(true)}
          hasRemark={!!remarks}
        />
      )}

      {/* Remarks Modal */}
      <RemarksModal
        isOpen={showRemarksModal}
        onClose={() => setShowRemarksModal(false)}
        onSubmit={handleSaveRemark}
        initialRemark={remarks}
      />

      {/* Toast Notification for New Job Assignments */}
      {showNotification && (
        <Toast
          message="A new service job has been assigned to you. Please review the details in your dashboard."
          onClose={dismissNotification}
        />
      )}
    </div>
  );
};

export default JobFlow;
