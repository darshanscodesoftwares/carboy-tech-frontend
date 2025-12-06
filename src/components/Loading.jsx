
import styles from './Loading.module.css';

const Loading = ({ message = 'Loading...' }) => (
  <div className={styles.container}>
    <div className={styles.spinner} />
    <p className={styles.message}>{message}</p>
  </div>
);

export default Loading;
