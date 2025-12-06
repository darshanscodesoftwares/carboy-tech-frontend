
import { useState, useEffect } from 'react';
import { getJobs } from '../api/jobs';
import { getTechnicianProfile } from '../api/auth';
import useTechnicianStore from '../store/technician';
import JobCard from '../components/JobCard';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import styles from './Dashboard.module.css';

const TABS = [
  { key: 'all', label: 'All Jobs' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

const Dashboard = () => {
  const { updateTechnician } = useTechnicianStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

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

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return job.status === 'pending';
    if (activeTab === 'in_progress') return ['accepted', 'traveling', 'reached', 'in_inspection'].includes(job.status);
    if (activeTab === 'completed') return job.status === 'completed';
    return true;
  });

  const counts = {
    all: jobs.length,
    pending: jobs.filter((j) => j.status === 'pending').length,
    in_progress: jobs.filter((j) => ['accepted', 'traveling', 'reached', 'in_inspection'].includes(j.status)).length,
    completed: jobs.filter((j) => j.status === 'completed').length,
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>My Jobs</h1>
          <p className={styles.subtitle}>Manage your assigned inspections</p>
        </div>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : styles.inactive}`}>
              {tab.label}
              <span className={`${styles.badge} ${activeTab === tab.key ? styles.active : styles.inactive}`}>{counts[tab.key]}</span>
            </button>
          ))}
        </div>
        {loading ? <Loading message="Loading jobs..." /> : error ? (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.errorButton}>Try again</button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No jobs found</p>
            <p className={styles.emptyText}>{activeTab === 'all' ? 'No jobs assigned yet' : `No ${activeTab.replace('_', ' ')} jobs`}</p>
          </div>
        ) : (
          <div className={styles.jobList}>{filteredJobs.map((job) => <JobCard key={job._id} job={job} />)}</div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
