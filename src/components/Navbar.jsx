
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
            <button onClick={handleLogout} className={styles.logoutButton} title="Logout">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
