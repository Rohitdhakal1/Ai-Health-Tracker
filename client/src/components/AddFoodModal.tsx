import { useState } from 'react';
import api from '../services/api';

interface Props {
    isOpen: boolean;    
    onClose: () => void;
    onFoodAdded: () => void;
}

// naya meal add karne wala modal
const AddFoodModal = ({isOpen , onClose , onFoodAdded}: Props)=>{

    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [aiQuery, setAiQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    if (!isOpen) return null;


    // AI analyze function
    const handleAnalyze = async () => {
        if (!aiQuery) return;
        
        setIsAnalyzing(true);
        try {
            const { data } = await api.post('/ai/food', { text: aiQuery });

            if (data && data.length > 0) {
                const totalCals = data.reduce((acc: number, item: any) => acc + item.calories, 0);
                const combinedNames = data.map((item: any) => item.name).join(' & ');

                setName(combinedNames);
                setCalories(totalCals.toString());
            }
        } catch (error) {
            console.error("AI Failed", error);
            alert("AI could not understand that. Try being more specific.");
        } finally {
            setIsAnalyzing(false);
        }
    };


    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        try {
            await api.post('/foods',{
                name,
                calories:Number(calories)
            });

            setName('');
            setCalories('');
            setAiQuery(''); 

            onClose();

            onFoodAdded();

        } catch (error) {
            console.error("Failed to add food", error);
            alert("Failed to add food");
        }
    };

    return (
        <div style={styles.overlay} className="fade-in">
            <div style={styles.modal}>
                <h2 style={styles.title}>Log Meal</h2>

                {/* AI section */}
                <div style={styles.aiSection}>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-main)', fontWeight: 600 }}>Use AI to estimate calories</p>
                    <textarea 
                        placeholder="e.g. 'I had 2 boiled eggs and toast'"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        style={styles.aiInput}
                    />
                    <button 
                        type="button" 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        style={styles.aiButton}
                        className="hover-lift"
                    >
                        {isAnalyzing ? 'Thinking...' : 'AI Analyze'}
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--accent-soft)' }} />
                    <span style={{ padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>OR ENTER MANUALLY</span>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--accent-soft)' }} />
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Food Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Chicken Salad" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    
                    <label style={styles.label}>Calories</label>
                    <input 
                        type="number" 
                        placeholder="0" 
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        style={styles.input}
                        required
                    />

                    <div style={styles.buttons}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn} className="hover-lift">Cancel</button>
                        <button type="submit" style={styles.submitBtn} className="hover-lift">Save Food</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'transparent',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    modal: {
        backgroundColor: 'var(--card-bg)', padding: '2.5rem', borderRadius: '20px',
        width: '90%', maxWidth: '450px', boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--accent-soft)',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 800,
        marginBottom: '1.5rem',
        color: 'var(--text-main)',
        letterSpacing: '-0.025em',
        textAlign: 'center' as const,
    },
    aiSection: { 
        display: 'flex', 
        flexDirection: 'column' as const, 
        gap: '0.75rem',
        marginBottom: '1.5rem',
        padding: '1.25rem',
        border: '1px solid var(--accent-soft)',
        borderRadius: '16px',
        background: 'var(--bg)',
    },
    aiInput: { 
        padding: '12px', 
        borderRadius: '10px', 
        border: '1px solid var(--accent-secondary)', 
        minHeight: '80px', 
        fontFamily: 'inherit',
        fontSize: '0.9375rem',
        resize: 'none' as const,
        backgroundColor: 'var(--card-bg)',
    },
    aiButton: { 
        padding: '10px', 
        borderRadius: '10px', 
        border: 'none', 
        background: 'var(--primary)', 
        color: 'var(--text-main)', 
        cursor: 'pointer', 
        fontWeight: 600,
        fontSize: '0.875rem',
        boxShadow: "0 10px 15px -3px rgba(243, 186, 96, 0.3)",
    },
    form: { display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
    label: { fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.025em' },
    input: { padding: '12px', borderRadius: '10px', border: '1px solid var(--accent-secondary)', fontSize: '0.9375rem', transition: 'var(--transition)', backgroundColor: 'var(--card-bg)' },
    buttons: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
    cancelBtn: { 
        flex: 1, 
        padding: '12px', 
        border: '1px solid var(--accent-secondary)', 
        background: 'var(--card-bg)', 
        cursor: 'pointer', 
        borderRadius: '10px', 
        fontWeight: 600, 
        color: 'var(--text-muted)',
    },
    submitBtn: { 
        flex: 1, 
        padding: '12px', 
        border: 'none', 
        background: 'var(--primary)', 
        color: 'var(--text-main)', 
        cursor: 'pointer', 
        borderRadius: '10px', 
        fontWeight: 700,
        boxShadow: "0 10px 15px -3px rgba(243, 186, 96, 0.3)",
    }
};

export default AddFoodModal;