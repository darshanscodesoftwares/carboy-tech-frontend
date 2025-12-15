import { useNavigate } from 'react-router-dom';
import uiConfig from '../config/uiConfig'; 
import ProgressBar from '../components/ProgressBar';  
import styles from './TravelProgressView.module.css';

const TravelProgressView = ({ currentStep, onReachedLocation }) => {
  const navigate = useNavigate();

  const steps = [
    { label: 'Accepted', key: 'accepted' },
    { label: 'Traveling', key: 'traveling' },
    { label: 'Reached Location', key: 'reached' },
    { label: 'Inspection Started', key: 'inspection' },
    { label: 'Inspection Completed', key: 'completed' }
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Job Progress</h2>

      {/* SWITCH HERE */}
      {uiConfig.useUnifiedProgressBar ? (
        // ⭐ Client-approved unified global progress bar
        <ProgressBar currentStep={currentStep} />
      ) : (
        // ⭐ Old custom travel progress bar (kept intact)
        <div className={styles.progressBar}>
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;

            return (
              <div key={step.key} className={styles.stepContainer}>
                <div className={styles.stepWrapper}>
                  <div
                    className={`${styles.stepCircle} 
                      ${isCompleted ? styles.completed : ''} 
                      ${isCurrent ? styles.current : ''} 
                      ${isUpcoming ? styles.upcoming : ''}`
                    }
                  >
                    {isCompleted ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isCurrent ? (
                      <>
                        {index === 1 && (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        )}
                        {index === 2 && (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                        )}
                        {index === 3 && (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                          </svg>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>

                  {index < steps.length - 1 && (
                    <div className={`${styles.connectingLine} ${isCompleted ? styles.lineCompleted : ''}`} />
                  )}
                </div>

                <p className={`${styles.stepLabel} ${isCurrent ? styles.labelCurrent : ''}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Map Section */}
      <div className={styles.mapContainer}>
        <div className={styles.mapPlaceholder}>
          <div className={styles.mapOverlay}>
            <button className={styles.viewMapButton}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View on Map
            </button>
            <p className={styles.mapText}>
              Your navigation to the customer location has started in Google Maps.
           
              Please follow directions to reach the destination.
            </p>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <button className={styles.actionButton} onClick={onReachedLocation}>
          Reached Location
        </button>
      )}

      <div className={styles.backButtonContainer}>
        <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default TravelProgressView;
