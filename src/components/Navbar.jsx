
import { useNavigate, useLocation } from 'react-router-dom';
import useTechnicianStore from '../store/technician';
import styles from './Navbar.module.css';

const Navbar = ({ showNotificationBadge = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { technician, logout: storeLogout } = useTechnicianStore();

  const handleLogout = () => { storeLogout(); navigate('/login'); };

  const isAssignedJobsPage = location.pathname === '/dashboard';

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand} onClick={() => navigate('/dashboard')}>
          <span className={styles.brandName}>CARBOY</span>
        </div>

        <div className={styles.navCenter}>
          <div className={styles.navItem}>
            <span className={isAssignedJobsPage ? styles.navLinkActive : styles.navLink}>
              Assigned Jobs
            </span>
            {showNotificationBadge && <span className={styles.notificationBadge}>3</span>}
          </div>
        </div>

        {technician && (
          <div className={styles.userSection}>
            <div className={styles.userAvatar}>
              <span className={styles.avatarText}>{technician.name?.charAt(0) || 'T'}</span>
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{technician.name || 'RAM.G'}</p>
              <p className={styles.userId}>{technician.employeeId || 'RAM003'}</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
