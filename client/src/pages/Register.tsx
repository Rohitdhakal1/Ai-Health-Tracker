import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// naya user sign up page
const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        gender: 'male',
        age: '',
        height: '',
        currentWeight: '',
        targetWeight: '',
        activityLevel: 'sedentary'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                age: Number(formData.age),
                height: Number(formData.height),
                currentWeight: Number(formData.currentWeight),
                targetWeight: Number(formData.targetWeight),
            };

            const { data } = await api.post('/users/register', payload);

            login(data.token, data);
            navigate('/dashboard');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={styles.container} className="fade-in">
            <div style={styles.card}>
                <h2 style={styles.title}>Join Us</h2>
                <p style={styles.subtitle}>Track your health journey</p>
                
                {error && <div style={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input name="name" placeholder="Full Name" onChange={handleChange} style={styles.input} required />
                    
                    <div style={styles.row}>
                        <input name="email" type="email" placeholder="Email" onChange={handleChange} style={styles.input} required />
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} style={styles.input} required />
                    </div>
                    
                    <div style={styles.row}>
                        <select name="gender" onChange={handleChange} style={styles.input}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <input name="age" type="number" placeholder="Age" onChange={handleChange} style={styles.input} required />
                    </div>

                    <div style={styles.row}>
                        <input name="height" type="number" placeholder="Height (cm)" onChange={handleChange} style={styles.input} required />
                        <select name="activityLevel" onChange={handleChange} style={styles.input}>
                            <option value="sedentary">Sedentary</option>
                            <option value="light">Light</option>
                            <option value="moderate">Moderate</option>
                            <option value="active">Active</option>
                        </select>
                    </div>

                    <div style={styles.row}>
                        <input name="currentWeight" type="number" placeholder="Weight (kg)" onChange={handleChange} style={styles.input} required />
                        <input name="targetWeight" type="number" placeholder="Goal (kg)" onChange={handleChange} style={styles.input} required />
                    </div>

                    <button type="submit" style={styles.button} className="hover-lift">Sign Up</button>
                </form>

                <p style={styles.footerText}>
                    Already have an account? <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

// register form styles
const styles = {
    container: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: 'var(--bg)', 
        padding: '1rem',
        overflow: 'hidden',
    },
    card: { 
        background: 'var(--card-bg)', 
        padding: '2.5rem', 
        borderRadius: '24px', 
        boxShadow: 'var(--shadow-lg)', 
        width: '100%', 
        maxWidth: '460px', 
        textAlign: 'center' as const,
        border: '1px solid var(--accent-soft)',
        position: 'relative' as const,
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 800,
        marginBottom: '0.25rem',
        color: 'var(--text-main)',
        letterSpacing: '-0.025em',
    },
    subtitle: {
        color: 'var(--text-muted)',
        marginBottom: '1.5rem',
        fontSize: '0.875rem',
    },
    form: { display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    input: { 
        padding: '10px 14px', 
        borderRadius: '10px', 
        border: '1px solid var(--accent-secondary)', 
        fontSize: '0.875rem', 
        width: '100%', 
        boxSizing: 'border-box' as const,
        transition: 'var(--transition)',
        backgroundColor: 'var(--bg)',
    },
    button: { 
        padding: '12px', 
        borderRadius: '12px', 
        border: 'none', 
        backgroundColor: 'var(--primary)', 
        color: 'var(--text-main)', 
        fontSize: '0.9375rem', 
        cursor: 'pointer', 
        fontWeight: 700,
        boxShadow: "0 10px 15px -3px rgba(243, 186, 96, 0.3)",
        marginTop: '0.5rem',
    },
    error: { 
        color: 'var(--danger)', 
        background: 'var(--accent-soft)', 
        padding: '8px', 
        borderRadius: '8px',
        border: '1px solid var(--accent-secondary)',
        marginBottom: '1rem',
        fontWeight: 500,
        fontSize: '0.8125rem',
    },
    footerText: {
        marginTop: '1.25rem',
        fontSize: '0.8125rem',
        color: 'var(--text-muted)',
    },
};

export default Register;