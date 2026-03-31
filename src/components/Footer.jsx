import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.companyName}><span style={{ color: "#0d745e" }}>MY</span><span style={{ color: "#1a1a1a" }}>CARBOY</span></p>
          <p className={styles.copyright}>© {new Date().getFullYear()} <span style={{ color: "#0d745e" }}>MY</span><span style={{ color: "#1a1a1a" }}>CARBOY</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
