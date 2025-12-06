
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import useTechnicianStore from '../store/technician';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useTechnicianStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { token, technician } = await login(email, password);
      setAuth(token, technician);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoText}>CB</span>
          </div>
          <h1 className={styles.title}>CarBoy Tech</h1>
          <p className={styles.subtitle}>Technician Portal</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>Sign In</h2>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={styles.input} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className={styles.input} required />
          </div>
          <button type="submit" disabled={loading || !email || !password} className={styles.submitButton}>
            {loading ? <><div className={styles.spinner} />Signing in...</> : 'Sign In'}
          </button>
        </form>
        <div className={styles.demo}>
          <p className={styles.demoText}>Demo: ravi.tech@carboy.com / ravi12345</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
