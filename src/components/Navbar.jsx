
import { useNavigate } from 'react-router-dom';
import useTechnicianStore from '../store/technician';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { technician, logout: storeLogout } = useTechnicianStore();

  const handleLogout = () => { storeLogout(); navigate('/login'); };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand} onClick={() => navigate('/dashboard')}>
          <div className={styles.logo}>CB</div>
          <span className={styles.brandName}>CarBoy Tech</span>
        </div>
        {technician && (
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{technician.name}</p>
              <p className={styles.userRole}>Technician</p>
            </div>
            <button onClick={handleLogout} className={styles.logoutButton} title="Logout">
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
