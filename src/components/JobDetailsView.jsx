import { useNavigate } from 'react-router-dom';
import { openGoogleMaps } from '../utils/maps';
import styles from './JobDetailsView.module.css';

const JobDetailsView = ({ job, onStartTravel }) => {
  const navigate = useNavigate();
  if (!job) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{job.serviceType}</h1>

      <div className={styles.contentGrid}>
        {/* Left Column - Customer & Vehicle Details */}
        <div className={styles.leftColumn}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Customer Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Customer Name</span>
                <span className={styles.value}>{job.customerSnapshot?.name || 'N/A'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Contact Number</span>
                <a href={`tel:${job.customerSnapshot?.phone}`} className={styles.valueLink}>
                  {job.customerSnapshot?.phone || 'N/A'}
                </a>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Email Address</span>
                <a href={`mailto:${job.customerSnapshot?.email}`} className={styles.valueLink}>
                  {job.customerSnapshot?.email || 'N/A'}
                </a>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Vehicle Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Car Brand</span>
                <span className={styles.value}>{job.vehicleSnapshot?.brand || 'N/A'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Model</span>
                <span className={styles.value}>{job.vehicleSnapshot?.model || 'N/A'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Year</span>
                <span className={styles.value}>{job.vehicleSnapshot?.year || 'N/A'}</span>
              </div>
              {/* <div className={styles.detailRow}>
                <span className={styles.label}>Fuel Type</span>
                <span className={styles.value}>{job.vehicleSnapshot?.fuelType || 'Petrol'}</span>
              </div> */}
            </div>
          </div>

          {job.customerRequirements && (
            <div className={styles.card}>
              <div className={styles.requirementHeader}>
                <svg className={styles.requirementIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className={styles.cardTitle}>Customer Requirement</h2>
              </div>
              <p className={styles.requirementText}>{job.customerRequirements}</p>
            </div>
          )}
        </div>

        {/* Right Column - Booking & Location */}
        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Booking & Location</h2>

            <div className={styles.infoSection}>
              <div className={styles.infoHeader}>
                <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className={styles.infoLabel}>Service Type</span>
              </div>
              <p className={styles.infoValue}>{job.serviceType}</p>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoHeader}>
                <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={styles.infoLabel}>Schedule</span>
              </div>
              <p className={styles.infoValue}>
                {job.schedule?.date || 'N/A'}
                <br />
                <span className={styles.timeSlot}>{job.schedule?.slot || 'N/A'}</span>
              </p>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoHeader}>
                <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className={styles.infoLabel}>Location</span>
              </div>
              <p className={styles.infoValue}>{job.location?.address || 'N/A'}</p>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.viewMapButton} onClick={() => openGoogleMaps(job.location)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                View on Map
              </button>
              <button className={styles.startTravelButton} onClick={onStartTravel}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Start Travel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Dashboard Button */}
      <div className={styles.backButtonContainer}>
        <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default JobDetailsView;
