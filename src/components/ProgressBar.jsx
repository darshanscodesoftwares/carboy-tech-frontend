import styles from './ProgressBar.module.css';

const ProgressBar = ({ currentStep }) => {
  // Each step now has its own SVG path.
  // Completed steps → always show tick mark.
  // Current & upcoming steps → use the original icon.
  const steps = [
    {
      key: 'accepted',
      label: 'Accepted',
      iconPath: "M5 13l4 4L19 7"
    },
    {
      key: 'traveling',
      label: 'Traveling',
      iconPath: "M13 7l5 5m0 0l-5 5m5-5H6"
    },
    {
      key: 'reached',
      label: 'Reached Location',
      iconPath: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    },
    {
      key: 'inspection',
      label: 'Inspection Started',
      iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
    },
    {
      key: 'completed',
      label: 'Inspection Completed',
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step.key} className={styles.stepWrapper}>
              <div className={styles.stepContainer}>

                <div
                  className={`${styles.circle} ${
                    isCompleted ? styles.completed :
                    isCurrent ? styles.current :
                    styles.upcoming
                  }`}
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    {isCompleted ? (
                      // COMPLETED → Always tick icon
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    ) : (
                      // CURRENT or UPCOMING → Use original icon
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={isCurrent ? 2.5 : 2}
                        d={step.iconPath}
                      />
                    )}
                  </svg>
                </div>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div
                    className={`${styles.connector} ${
                      isCompleted
                        ? styles.connectorCompleted
                        : isUpcoming
                        ? styles.connectorUpcoming
                        : styles.connectorCurrent
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`${styles.label} ${
                  isCompleted
                    ? styles.labelCompleted
                    : isCurrent
                    ? styles.labelCurrent
                    : styles.labelUpcoming
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
