
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, acceptJob } from '../api/jobs';
import { getTechnicianProfile } from '../api/auth';
import useTechnicianStore from '../store/technician';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { updateTechnician, clearNotification } = useTechnicianStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingJobId, setAcceptingJobId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Clear notification badge immediately when Dashboard loads
      clearNotification();

      try {
        console.log('Fetching technician profile and jobs...'); // Debug log

        const [technicianData, jobsData] = await Promise.all([
          getTechnicianProfile(),
          getJobs()
        ]);

        console.log('Technician data received:', technicianData); // Debug log
        console.log('Jobs data received:', jobsData); // Debug log

        // Update technician in store
        updateTechnician(technicianData);
        // Filter out completed jobs
        const filteredJobs = jobsData.filter(job => job.status !== 'completed');
        setJobs(filteredJobs);
      } catch (err) {
        console.error('Dashboard fetch error:', err); // Debug log
        setError(err.response?.data?.error || err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [updateTechnician, clearNotification]);

  const pendingCount = jobs.filter((j) => j.status === 'pending').length;

  // Pagination calculations
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = jobs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccept = async (jobId, e) => {
    e.stopPropagation();
    setAcceptingJobId(jobId);
    try {
      await acceptJob(jobId);
      // Update the job status in the local state
      setJobs(prevJobs => prevJobs.map(job =>
        job._id === jobId ? { ...job, status: 'accepted' } : job
      ));
      // Redirect to the flow page
      navigate(`/flow/${jobId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to accept job');
    } finally {
      setAcceptingJobId(null);
    }
  };

  const handleViewDetails = (jobId, e) => {
    e.stopPropagation();
    navigate(`/flow/${jobId}`);
  };

  const getStatusInfo = (status) => {
    if (status === 'pending') return { label: 'Pending', className: styles.statusPending };
    if (status === 'accepted') return { label: 'Accepted', className: styles.statusAccepted };
    if (status === 'traveling') return { label: 'Traveling', className: styles.statusTraveling };
    if (status === 'reached') return { label: 'Reached Location', className: styles.statusReached };
    if (status === 'in_inspection') return { label: 'Inspection Started', className: styles.statusInspection };
    if (status === 'completed') return { label: 'Completed', className: styles.statusCompleted };
    return { label: status, className: styles.statusPending };
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#FFE7A1' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Pending Jobs</p>
              <p className={styles.statValue}>{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className={styles.jobsSection}>
          <h2 className={styles.sectionTitle}>My Assigned Jobs</h2>

          {loading ? (
            <Loading message="Loading jobs..." />
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className={styles.errorButton}>Try again</button>
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
                        <td>{job.customerSnapshot?.name || 'N/A'}</td>
                        <td>{job.serviceType}</td>
                        <td>{job.vehicleSnapshot?.year} {job.vehicleSnapshot?.brand} {job.vehicleSnapshot?.model}</td>
                        <td>
                          <div className={styles.location}>
                            <svg className={styles.locationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <span>{job.location?.address || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.schedule}>
                            <div>{job.schedule?.date}</div>
                            <div className={styles.scheduleTime}>{job.schedule?.slot}</div>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td>
                          {job.status === 'pending' ? (
                            <button onClick={(e) => handleAccept(job._id, e)} disabled={acceptingJobId === job._id} className={styles.acceptButton}>
                              {acceptingJobId === job._id ? 'Accepting...' : 'Accept'}
                            </button>
                          ) : job.status === 'accepted' || job.status === 'traveling' || job.status === 'reached' || job.status === 'in_inspection' ? (
                            <button onClick={(e) => handleViewDetails(job._id, e)} className={styles.viewDetailsButton}>
                              View details →
                            </button>
                          ) : (
                            <button onClick={(e) => handleViewDetails(job._id, e)} className={styles.viewDetailsButton}>
                              View details →
                            </button>
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
  </div>
);
};

export default Dashboard;
