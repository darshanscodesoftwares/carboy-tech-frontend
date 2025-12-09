
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../api/jobs';
import { getTechnicianProfile } from '../api/auth';
import useTechnicianStore from '../store/technician';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { updateTechnician } = useTechnicianStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const [technicianData, jobsData] = await Promise.all([getTechnicianProfile(), getJobs()]);
        updateTechnician(technicianData);
        setJobs(jobsData);
      } catch (err) { setError(err.response?.data?.error || 'Failed to load data'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [updateTechnician]);

  const completedCount = jobs.filter((j) => j.status === 'completed').length;
  const pendingCount = jobs.filter((j) => j.status === 'pending').length;

  const handleAccept = async (jobId, e) => {
    e.stopPropagation();
    navigate(`/flow/${jobId}`);
  };

  const handleViewDetails = (jobId, e) => {
    e.stopPropagation();
    navigate(`/flow/${jobId}`);
  };

  const getStatusInfo = (status) => {
    if (status === 'pending') return { label: 'Pending', className: styles.statusPending };
    if (status === 'accepted' || status === 'traveling' || status === 'reached' || status === 'in_inspection') {
      return { label: 'Accepted', className: styles.statusAccepted };
    }
    if (status === 'completed') return { label: 'Completed', className: styles.statusCompleted };
    return { label: status, className: styles.statusPending };
  };

  return (
    <div className={styles.container}>
      <Navbar showNotificationBadge={pendingCount > 0} />
      <main className={styles.main}>
        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#B2F3D8' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Completed Jobs</p>
              <p className={styles.statValue}>{completedCount}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#FFE7A1' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Pending</p>
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
                  {jobs.map((job, index) => {
                    const statusInfo = getStatusInfo(job.status);
                    return (
                      <tr key={job._id} onClick={() => navigate(`/flow/${job._id}`)} className={styles.tableRow}>
                        <td>{index + 1}.</td>
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
                            <button onClick={(e) => handleAccept(job._id, e)} className={styles.acceptButton}>
                              Accept
                            </button>
                          ) : job.status === 'accepted' || job.status === 'traveling' || job.status === 'reached' ? (
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
