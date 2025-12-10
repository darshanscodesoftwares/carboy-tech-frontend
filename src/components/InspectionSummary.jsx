import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import styles from './InspectionSummary.module.css';

const InspectionSummary = ({ job }) => {
  const navigate = useNavigate();

  if (!job) return null;

  const summaryData = [
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Customer',
      value: job.customerSnapshot?.name || 'N/A',
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
      label: 'Vehicle',
      value: `${job.vehicleSnapshot?.year || ''} ${job.vehicleSnapshot?.brand || ''} ${job.vehicleSnapshot?.model || ''}`.trim() || 'N/A',
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Location',
      value: job.location?.address || 'N/A',
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      label: 'Service Type',
      value: job.serviceType || 'N/A',
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Completion Date',
      value: job.schedule?.date || new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Completion Time',
      value: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.progressCard}>
        <ProgressBar currentStep={5} />
      </div>
      <div className={styles.successBanner}>
        <div className={styles.successIconContainer}>
          <svg className={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className={styles.successContent}>
          <h1 className={styles.successTitle}>Inspection Completed!</h1>
          <p className={styles.successDescription}>
            Used car inspection has been successfully completed and submitted to admin
          </p>
        </div>
      </div>

      <div className={styles.summarySection}>
        <h2 className={styles.sectionTitle}>Job Summary</h2>
        <div className={styles.summaryGrid}>
          {summaryData.map((item, index) => (
            <div key={index} className={styles.summaryCard}>
              <div className={styles.cardIcon}>{item.icon}</div>
              <div className={styles.cardContent}>
                <p className={styles.cardLabel}>{item.label}</p>
                <p className={styles.cardValue}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.reportBlock}>
        <div className={styles.reportHeader}>
          <svg className={styles.reportIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className={styles.reportTitle}>Report Submitted to Admin</h3>
        </div>
        <p className={styles.reportText}>
          Your detailed inspection report with photos and remarks has been automatically send to the admin team. The will review it and share it with the customer.
        </p>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.secondaryButton}
          onClick={() => alert('View/Edit Report feature coming soon!')}
        >
          View/Edit Report
        </button>
        <button
          className={styles.primaryButton}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      <p className={styles.footerText}>
        Thank you for your thorough inspection work!
      </p>
    </div>
  );
};

export default InspectionSummary;
