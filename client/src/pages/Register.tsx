import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');

    // 1. Single State Object for all inputs (Cleaner Code!)
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

    // 2. Generic Change Handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // 3. Convert numbers (Inputs are always strings by default)
            const payload = {
                ...formData,
                age: Number(formData.age),
                height: Number(formData.height),
                currentWeight: Number(formData.currentWeight),
                targetWeight: Number(formData.targetWeight),
            };

            // 4. API Call
            const { data } = await api.post('/users/register', payload);

            // 5. Auto-Login after success
            login(data.token, data);
            navigate('/dashboard');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>🚀 Create Account</h2>
                {error && <p style={styles.error}>{error}</p>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input name="name" placeholder="Full Name" onChange={handleChange} style={styles.input} required />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} style={styles.input} required />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} style={styles.input} required />
                    
                    <div style={styles.row}>
                        <select name="gender" onChange={handleChange} style={styles.input}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="male">Trans</option>
                        </select>
                        <input name="age" type="number" placeholder="Age" onChange={handleChange} style={styles.input} required />
                    </div>

                    <div style={styles.row}>
                        <input name="height" type="number" placeholder="Height (cm)" onChange={handleChange} style={styles.input} required />
                        <select name="activityLevel" onChange={handleChange} style={styles.input}>
                            <option value="sedentary">Sedentary (Office Job)</option>
                            <option value="light">Light Exercise</option>
                            <option value="moderate">Moderate Exercise</option>
                            <option value="active">Active</option>
                        </select>
                    </div>

                    <div style={styles.row}>
                        <input name="currentWeight" type="number" placeholder="Current Weight (kg)" onChange={handleChange} style={styles.input} required />
                        <input name="targetWeight" type="number" placeholder="Goal Weight (kg)" onChange={handleChange} style={styles.input} required />
                    </div>

                    <button type="submit" style={styles.button}>Sign Up</button>
                </form>

                <p style={{marginTop: '1rem'}}>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '2rem' },
    card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px', textAlign: 'center' as const },
    form: { display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginTop: '1rem' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    input: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' as const },
    button: { padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#28a745', color: 'white', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' as const },
    error: { color: 'red', background: '#ffe6e6', padding: '0.5rem', borderRadius: '4px' }
};

export default Register;