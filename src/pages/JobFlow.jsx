
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useJobFlow, { JOB_STATUSES, getStepIndex } from '../hooks/useJobFlow';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobDetailsView from '../components/JobDetailsView';
import TravelProgressView from '../components/TravelProgressView';
import ProgressBar from '../components/ProgressBar';
import ChecklistItem from '../components/ChecklistItem';
import Loading from '../components/Loading';
import styles from './JobFlow.module.css';

const JobFlow = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { job, checklist, summary, loading, error, setError, fetchJob, startTravel, reachedLocation, startInspection, fetchChecklist, submitCheckpoint, completeJob, fetchSummary } = useJobFlow();
  const [actionLoading, setActionLoading] = useState(false);
  const [checkpointLoading, setCheckpointLoading] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm, setReportForm] = useState({ summary: '', overallStatus: 'PASS', recommendations: [] });
  const [newRec, setNewRec] = useState({ text: '', severity: 'low' });

  useEffect(() => { if (jobId) fetchJob(jobId); }, [jobId, fetchJob]);
  useEffect(() => { if (job?.status === JOB_STATUSES.IN_INSPECTION && !checklist) fetchChecklist(jobId); }, [job?.status, checklist, jobId, fetchChecklist]);

  const handleAction = async (action) => { setActionLoading(true); setError(null); try { await action(); } catch { } finally { setActionLoading(false); } };
  const handleCheckpointSubmit = async (checkpoint) => { setCheckpointLoading(true); try { await submitCheckpoint(jobId, checkpoint); } catch { } finally { setCheckpointLoading(false); } };
  const handleAddRec = () => { if (!newRec.text.trim()) return; setReportForm((p) => ({ ...p, recommendations: [...p.recommendations, { ...newRec }] })); setNewRec({ text: '', severity: 'low' }); };
  const handleRemoveRec = (idx) => setReportForm((p) => ({ ...p, recommendations: p.recommendations.filter((_, i) => i !== idx) }));
  const handleSubmitReport = async () => { if (!reportForm.summary.trim()) { setError('Please provide a summary'); return; } setActionLoading(true); try { await completeJob(jobId, reportForm); await fetchSummary(jobId); } catch { } finally { setActionLoading(false); } };
  const getExistingAnswer = (key) => job?.checklistAnswers?.find((a) => a.checkpointKey === key);
  const allCheckpointsCompleted = () => checklist?.items && checklist.items.every((item) => job?.checklistAnswers?.some((a) => a.checkpointKey === item.key));

  const renderActionButton = () => {
    if (!job) return null;
    // Don't show Accept button anymore - accepting happens from Dashboard
    const config = { [JOB_STATUSES.ACCEPTED]: { label: 'Start Travel', action: () => startTravel(jobId) }, [JOB_STATUSES.REACHED]: { label: 'Start Inspection', action: () => startInspection(jobId) } };
    const btn = config[job.status]; if (!btn) return null;
    return <button onClick={() => handleAction(btn.action)} disabled={actionLoading} className={styles.primaryButton}>{actionLoading ? <><div className={styles.spinner} />Processing...</> : btn.label}</button>;
  };

  const renderSummary = () => {
    if (!summary) return <div className={styles.emptyChecklist}><button onClick={() => fetchSummary(jobId)} disabled={loading} className={styles.primaryButton}>{loading ? 'Loading...' : 'View Summary'}</button></div>;
    const { report } = summary;
    return (
      <div className={styles.summaryContainer}>
        <div className={styles.successBanner}>
          <svg className={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h2 className={styles.successTitle}>Inspection Complete</h2>
        </div>
        <div className={styles.summaryCard}>
          <h3 className={styles.summaryCardTitle}>Report Summary</h3>
          <div className={styles.summaryStatus}><span className={styles.summaryStatusLabel}>Status:</span> <span className={`${styles.summaryStatusValue} ${report.overallStatus === 'PASS' ? 'bg-green-100 text-green-800' : report.overallStatus === 'FAIL' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`} style={{ backgroundColor: report.overallStatus === 'PASS' ? '#d1fae5' : report.overallStatus === 'FAIL' ? '#fecaca' : '#fef3c7', color: report.overallStatus === 'PASS' ? '#065f46' : report.overallStatus === 'FAIL' ? '#991b1b' : '#92400e' }}>{report.overallStatus}</span></div>
          <p className={styles.summaryText}>{report.summary}</p>
          {report.recommendations?.length > 0 && <ul className={styles.recommendationList}>{report.recommendations.map((r, i) => <li key={i} className={styles.recommendationItem}><span className={`${styles.severityBadge} ${styles[r.severity]}`}>{r.severity}</span>{r.text}</li>)}</ul>}
        </div>
        <button onClick={() => navigate('/dashboard')} className={styles.primaryButton}>Back to Dashboard</button>
      </div>
    );
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

    // Completed Summary View
    if (job?.status === JOB_STATUSES.COMPLETED || summary) {
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

        {job?.status === JOB_STATUSES.IN_INSPECTION && (
          <div className={styles.checklistSection}>
            <h3 className={styles.checklistTitle}>Inspection Checklist</h3>
            {loading && !checklist ? <Loading message="Loading checklist..." /> : checklist?.items ? (
              <>
                {checklist.items.map((item) => <ChecklistItem key={item.key} item={item} onSubmit={handleCheckpointSubmit} isSubmitting={checkpointLoading} existingAnswer={getExistingAnswer(item.key)} />)}
                {allCheckpointsCompleted() && (
                  <div style={{ marginTop: 'var(--space-lg)' }}>
                    {!showReportForm ? <button onClick={() => setShowReportForm(true)} className={styles.primaryButton}>Proceed to Submit Report</button> : (
                      <div className={styles.reportForm}>
                        <h3 className={styles.formTitle}>Final Report</h3>
                        <div className={styles.formField}><label className={styles.formLabel}>Summary *</label><textarea value={reportForm.summary} onChange={(e) => setReportForm((p) => ({ ...p, summary: e.target.value }))} placeholder="Overall inspection summary..." className={styles.textarea} rows={3} /></div>
                        <div className={styles.formField}><label className={styles.formLabel}>Overall Status</label><div className={styles.statusButtons}>{['PASS', 'ATTENTION', 'FAIL'].map((s) => <button key={s} type="button" onClick={() => setReportForm((p) => ({ ...p, overallStatus: s }))} className={`${styles.statusButton} ${styles[s.toLowerCase()]} ${reportForm.overallStatus === s ? styles.selected : ''}`}>{s}</button>)}</div></div>
                        <div className={styles.formField}><label className={styles.formLabel}>Recommendations</label>{reportForm.recommendations.length > 0 && <div className={styles.recommendationsList}>{reportForm.recommendations.map((r, i) => <div key={i} className={styles.recommendation}><span className={`${styles.severityBadge} ${styles[r.severity]}`}>{r.severity}</span><span className={styles.recommendationText}>{r.text}</span><button onClick={() => handleRemoveRec(i)} className={styles.removeButton}>X</button></div>)}</div>}<div className={styles.addRecommendation}><input value={newRec.text} onChange={(e) => setNewRec((p) => ({ ...p, text: e.target.value }))} placeholder="Add recommendation..." className={styles.input} /><select value={newRec.severity} onChange={(e) => setNewRec((p) => ({ ...p, severity: e.target.value }))} className={styles.select}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select><button onClick={handleAddRec} className={styles.addButton}>+</button></div></div>
                        <button onClick={handleSubmitReport} disabled={actionLoading || !reportForm.summary.trim()} className={styles.primaryButton}>{actionLoading ? <><div className={styles.spinner} />Submitting...</> : 'Complete Inspection'}</button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : <p className={styles.emptyChecklist}>No checklist available</p>}
          </div>
        )}

        {job?.status !== JOB_STATUSES.IN_INSPECTION && renderActionButton()}
        <button onClick={() => navigate('/dashboard')} className={styles.secondaryButton}>Back to Dashboard</button>
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
    </div>
  );
};

export default JobFlow;
