
import { useNavigate, useLocation } from 'react-router-dom';
import useTechnicianStore from '../store/technician';
import styles from './Navbar.module.css';
import { RiLogoutCircleRLine } from "react-icons/ri";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { technician, logout: storeLogout, notificationCount } = useTechnicianStore();

  const handleLogout = () => { storeLogout(); navigate('/login'); };

  const isAssignedJobsPage = location.pathname === '/dashboard';

  // Show badge only on /flow/* and /summary/* paths
  const shouldShowBadge =
    (location.pathname.startsWith('/flow/') || location.pathname.startsWith('/summary/')) &&
    notificationCount > 0;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand} onClick={() => navigate('/dashboard')}>
          <span className={styles.brandName}>MYCARBOY</span>
        </div>

        <div className={styles.navLeft}>
          <div className={styles.navItem}>
            <span className={isAssignedJobsPage ? styles.navLinkActive : styles.navLink}>
              Assigned Jobs
            </span>
            {shouldShowBadge && <span className={styles.notificationBadge}>{notificationCount}</span>}
          </div>
        </div>

        {technician && (
          <div className={styles.userSection}>
            <div className={styles.userAvatar}>
              <span className={styles.avatarText}>{technician.name?.charAt(0) || 'T'}</span>
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{technician.name}</p>
              <p className={styles.userId}>{technician.employeeId}</p>
            </div>

            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              title="Logout"
            >
              <RiLogoutCircleRLine className={styles.logoutIcon} />
            </button>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
