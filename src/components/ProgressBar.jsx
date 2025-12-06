
import { PROGRESS_STEPS } from '../hooks/useJobFlow';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ currentStep }) => (
  <div className={styles.container}>
    <div className={styles.steps}>
      {PROGRESS_STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        return (
          <div key={step.key} className={styles.step}>
            {index > 0 && (
              <div className={`${styles.connector} ${isCompleted ? styles.completed : styles.pending}`} />
            )}
            <div className={`${styles.circle} ${isCompleted ? styles.completed : isCurrent ? styles.current : styles.pending}`}>
              {isCompleted ? (
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : index + 1}
            </div>
            <span className={`${styles.label} ${isCompleted ? styles.completed : isCurrent ? styles.current : styles.pending}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

export default ProgressBar;
