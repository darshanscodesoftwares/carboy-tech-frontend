import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getJobs, acceptJob } from "../api/jobs";
import { getTechnicianProfile } from "../api/auth";
import { getTodayAttendance } from "../api/attendance";
import api from "../api/index";
import useTechnicianStore from "../store/technician";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import AttendanceModal from "../components/AttendanceModal";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { updateTechnician, clearNotification } = useTechnicianStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingJobId, setAcceptingJobId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [attended, setAttended] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [denyModal, setDenyModal] = useState(null);
  const [denyReason, setDenyReason] = useState('');
  const [denyNote, setDenyNote] = useState('');
  const [denySubmitting, setDenySubmitting] = useState(false);
  const [denyError, setDenyError] = useState(null);

  useEffect(() => {
    getTodayAttendance()
      .then((d) => setAttended(d?.attended || false))
      .catch(() => {})
      .finally(() => setAttendanceLoading(false));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Clear notification badge immediately when Dashboard loads
      clearNotification();

      try {

        const [technicianData, jobsData] = await Promise.all([
          getTechnicianProfile(),
          getJobs(),
        ]);


        // Update technician in store
        updateTechnician(technicianData);
        // Show only jobs scheduled for today (with a 24h past grace for
        // late-running inspections). Future-dated jobs are hidden until
        // their day arrives. schedule.date moves with reschedules, so a
        // future-dated job will appear on its day automatically.
        const now = Date.now();
        const pastCutoff = now - 24 * 60 * 60 * 1000;
        // End of today in IST (24:00 IST = 18:30 UTC of same UTC day)
        const istNow = new Date(now + 5.5 * 60 * 60 * 1000);
        istNow.setUTCHours(24, 0, 0, 0);
        const endOfTodayIST = istNow.getTime() - 5.5 * 60 * 60 * 1000;

        const filteredJobs = jobsData.filter((job) => {
          if (job.status === "completed") return false;
          // Cancelled jobs that the IE has already acknowledged leave the table
          if (job.status === "cancelled" && job.ieDenial?.acknowledgedAt) return false;
          const sched = job.schedule?.date ? new Date(job.schedule.date).getTime() : null;
          if (!sched) return true;
          if (sched < pastCutoff) return false;
          if (sched > endOfTodayIST) return false;
          return true;
        });
        setJobs(filteredJobs);
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [updateTechnician, clearNotification]);

  const pendingCount = jobs.filter((j) => j.status === "pending").length;

  // Pagination calculations
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = jobs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAccept = async (jobId, e) => {
    e.stopPropagation();
    setAcceptingJobId(jobId);
    try {
      await acceptJob(jobId);
      // Update the job status in the local state
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, status: "accepted" } : job
        )
      );
      // Redirect to the flow page
      navigate(`/flow/${jobId}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to accept job");
    } finally {
      setAcceptingJobId(null);
    }
  };

  const handleViewDetails = (jobId, e) => {
    e.stopPropagation();
    navigate(`/flow/${jobId}`);
  };

  const formatScheduleDate = (raw) => {
    if (!raw) return "—";
    const d = new Date(raw);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  };

  const getStatusInfo = (status) => {
    if (status === "pending")
      return { label: "Pending", className: styles.statusPending };
    if (status === "accepted")
      return { label: "Accepted", className: styles.statusAccepted };
    if (status === "traveling")
      return { label: "Traveling", className: styles.statusTraveling };
    if (status === "reached")
      return { label: "Reached Location", className: styles.statusReached };
    if (status === "in_inspection")
      return {
        label: "Inspection Started",
        className: styles.statusInspection,
      };
    if (status === "completed")
      return { label: "Completed", className: styles.statusCompleted };
    if (status === "cancelled")
      return { label: "Cancelled", className: styles.statusCancelled };
    return { label: status, className: styles.statusPending };
  };

  const isCancelledJob = (job) => job?.status === 'cancelled';

  const handleDenySubmit = async () => {
    if (!denyReason) return;
    setDenySubmitting(true);
    setDenyError(null);
    try {
      const jobId = denyModal._id;
      const isCancelled = isCancelledJob(denyModal);
      const type = isCancelled ? 'acknowledgeCancel' : 'requestCancel';
      const jobsBase = api.defaults.baseURL.replace(/\/technician$/, '');
      const token = localStorage.getItem('token');
      const res = await axios.post(`${jobsBase}/jobs/${jobId}/ie-denial`, { reason: denyReason, note: denyNote, type }, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      // For acknowledged cancellations: remove from list (already cancelled, now recorded)
      // For IE self-cancel requests: update job status locally to show pending, keep in list
      if (isCancelled) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      } else {
        setJobs((prev) => prev.map((j) => j._id === jobId ? { ...j, ieDenial: { acknowledgedAt: new Date(), reason: denyReason, note: denyNote }, _ieCancelPending: true } : j));
      }
      setDenyModal(null);
      setDenyReason('');
      setDenyNote('');
    } catch (err) {
      setDenyError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setDenySubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ backgroundColor: "#FFE7A1" }}
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Pending Jobs</p>
              <p className={styles.statValue}>{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Attendance Banner */}
        {!attendanceLoading && (
          <div className={styles.attendanceBanner}>
            {attended ? (
              <span className={styles.attendedBadge}>✓ Attended</span>
            ) : (
              <button className={styles.attendanceBtn} onClick={() => setShowAttendanceModal(true)}>
                📷 Mark Attendance
              </button>
            )}
          </div>
        )}

        <div className={styles.jobsSection}>
          <h2 className={styles.sectionTitle}>My Assigned Jobs</h2>

          {!attendanceLoading && !attended ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>📷 Please mark attendance to view your jobs</p>
              <p className={styles.emptyText}>
                Tap the "Mark Attendance" button above to check in for today.
                Your assigned jobs will appear here once attendance is marked.
              </p>
            </div>
          ) : loading ? (
            <Loading message="Loading jobs..." />
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className={styles.errorButton}
              >
                Try again
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>No jobs found</p>
              <p className={styles.emptyText}>No jobs assigned yet</p>
            </div>
          ) : (
            <>
              <div className={styles.tableWrapper}>
                <table className={styles.jobTable}>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Customer</th>
                      <th>Service Type</th>
                      <th>Vehicle</th>
                      <th>Location</th>
                      <th>Schedule</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedJobs.map((job, index) => {
                      const statusInfo = getStatusInfo(job.status);
                      const actualIndex = startIndex + index;
                      return (
                        <tr key={job._id} className={styles.tableRow}>
                          {/* onClick={() => navigate(`/flow/${job._id}`)} */}
                          <td>{actualIndex + 1}.</td>
                          <td>{job.customerSnapshot?.name || "N/A"}</td>
                          <td>{job.serviceType}</td>
                          <td>
                            {job.vehicleSnapshot?.year}{" "}
                            {job.vehicleSnapshot?.brand}{" "}
                            {job.vehicleSnapshot?.model}
                          </td>
                          <td>
                            <div className={styles.location}>
                              <svg
                                className={styles.locationIcon}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                              </svg>
                              <span>{job.location?.address || "N/A"}</span>
                            </div>
                          </td>
                          <td>
                            <div className={styles.schedule}>
                              <div>{formatScheduleDate(job.schedule?.date)}</div>
                              <div className={styles.scheduleTime}>
                                {job.schedule?.slot}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`${styles.statusBadge} ${statusInfo.className}`}
                            >
                              {statusInfo.label}
                            </span>
                          </td>
                          <td>
                            {job.status === "pending" ? (
                              <button
                                onClick={(e) => handleAccept(job._id, e)}
                                disabled={acceptingJobId === job._id}
                                className={styles.acceptButton}
                              >
                                {acceptingJobId === job._id ? "Accepting..." : "Accept"}
                              </button>
                            ) : job.status === "cancelled" ? (
                              job.ieDenial?.acknowledgedAt ? (
                                <span className={styles.acknowledgedBadge}>Acknowledged</span>
                              ) : (
                                <button
                                  className={styles.denyButton}
                                  onClick={(e) => { e.stopPropagation(); setDenyModal(job); setDenyReason(''); setDenyNote(''); setDenyError(null); }}
                                >
                                  Deny
                                </button>
                              )
                            ) : (
                              <div className={styles.actionGroup}>
                                <button
                                  onClick={(e) => handleViewDetails(job._id, e)}
                                  className={styles.viewDetailsButton}
                                >
                                  <div className={styles.viewButton}>View</div>
                                  <div className={styles.arrowButton}>→</div>
                                </button>
                                {(job._ieCancelPending || (job.ieDenial?.acknowledgedAt && job.status !== 'cancelled')) ? (
                                  <span className={styles.pendingCancelBadge}>Cancel Pending</span>
                                ) : !job.ieDenial?.acknowledgedAt && (
                                  <button
                                    className={styles.denyButton}
                                    onClick={(e) => { e.stopPropagation(); setDenyModal(job); setDenyReason(''); setDenyNote(''); setDenyError(null); }}
                                  >
                                    Deny
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                  >
                    Previous
                  </button>
                  <span className={styles.pageInfo}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.paginationButton}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      {showAttendanceModal && (
        <AttendanceModal
          onClose={() => setShowAttendanceModal(false)}
          onSuccess={() => {
            setAttended(true);
            setShowAttendanceModal(false);
          }}
        />
      )}

      {denyModal && (
        <div className={styles.denyOverlay} onClick={() => !denySubmitting && setDenyModal(null)}>
          <div className={styles.denyCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.denyTitle}>
              {isCancelledJob(denyModal) ? 'Acknowledge Cancellation' : 'Request Cancellation'}
            </h3>
            <p className={styles.denySubtitle}>
              {denyModal.customerSnapshot?.name} — {denyModal.vehicleSnapshot?.brand} {denyModal.vehicleSnapshot?.model}
            </p>
            {!isCancelledJob(denyModal) && (
              <p className={styles.denyInfo}>
                This will send a cancellation request to admin for approval. The job will be cancelled only after admin confirms.
              </p>
            )}
            <label className={styles.denyLabel}>Reason *</label>
            <select
              className={styles.denySelect}
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              disabled={denySubmitting}
            >
              <option value="">Select a reason</option>
              <option value="Check-In-Deny">Check-In-Deny</option>
              <option value="Cancelled before start ride">Cancelled before start ride</option>
              <option value="Seller Issue">Seller Issue</option>
              <option value="IE Self-Cancel">IE Self-Cancel</option>
              <option value="Others">Others</option>
            </select>
            <label className={styles.denyLabel}>Note (optional)</label>
            <textarea
              className={styles.denyTextarea}
              placeholder="Add any additional details..."
              value={denyNote}
              onChange={(e) => setDenyNote(e.target.value)}
              disabled={denySubmitting}
              rows={3}
            />
            {denyError && <p className={styles.denyError}>{denyError}</p>}
            <div className={styles.denyActions}>
              <button className={styles.denyCancelBtn} onClick={() => setDenyModal(null)} disabled={denySubmitting}>Cancel</button>
              <button className={styles.denySubmitBtn} onClick={handleDenySubmit} disabled={denySubmitting || !denyReason}>
                {denySubmitting ? 'Submitting...' : isCancelledJob(denyModal) ? 'Acknowledge' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
