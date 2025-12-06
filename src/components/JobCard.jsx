
import { useNavigate } from 'react-router-dom';
import styles from './JobCard.module.css';

const STATUS_COLORS = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  accepted: { bg: '#dbeafe', text: '#1e40af' },
  traveling: { bg: '#e0e7ff', text: '#3730a3' },
  reached: { bg: '#fce7f3', text: '#9d174d' },
  in_inspection: { bg: '#fed7aa', text: '#9a3412' },
  completed: { bg: '#d1fae5', text: '#065f46' },
};

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const statusColor = STATUS_COLORS[job.status] || STATUS_COLORS.pending;

  return (
    <div className={styles.card} onClick={() => navigate(`/flow/${job._id}`)}>
      <div className={styles.header}>
        <span className={styles.serviceType}>{job.serviceType}</span>
        <span className={styles.statusBadge} style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>{job.status.replace('_', ' ')}</span>
      </div>
      <div className={styles.customer}>
        <h3 className={styles.customerName}>{job.customerSnapshot?.name}</h3>
        <p className={styles.customerPhone}>{job.customerSnapshot?.phone}</p>
      </div>
      <div className={styles.vehicle}>
        <p className={styles.vehicleModel}>{job.vehicleSnapshot?.brand} {job.vehicleSnapshot?.model}</p>
        <p className={styles.vehicleYear}>{job.vehicleSnapshot?.year}</p>
      </div>
      <div className={styles.schedule}>
        <span className={styles.scheduleDate}>{job.schedule?.date}</span>
        <span className={styles.scheduleSlot}>{job.schedule?.slot}</span>
      </div>
      <div className={styles.location}>
        <svg className={styles.locationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
        <span className={styles.locationAddress}>{job.location?.address}</span>
      </div>
    </div>
  );
};

export default JobCard;
