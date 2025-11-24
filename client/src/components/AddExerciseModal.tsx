import { useState } from 'react';
import api from '../services/api';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onExerciseAdded: () => void;
}

const AddExerciseModal = ({ isOpen, onClose, onExerciseAdded }: Props) => {
    const [activityName, setActivityName] = useState('');
    const [caloriesBurned, setCaloriesBurned] = useState('');
    const [durationMinutes, setDurationMinutes] = useState('');

    // --- AI STATE ---
    const [aiQuery, setAiQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);


    if (!isOpen) return null;

    // --- THE MAGIC AI FUNCTION ---
    const handleAnalyze = async () => {
        if (!aiQuery) return;
        
        setIsAnalyzing(true);
        try {
            // 1. Call the EXERCISE endpoint
            const { data } = await api.post('/ai/exercise', { text: aiQuery });

            if (data && data.length > 0) {
                // 2. Aggregate the results (Sum up calories and time)
                const totalCals = data.reduce((acc: number, item: any) => acc + item.caloriesBurned, 0);
                const totalTime = data.reduce((acc: number, item: any) => acc + item.durationMinutes, 0);
                const combinedNames = data.map((item: any) => item.activityName).join(' & ');

                // 3. Auto-fill the form
                setActivityName(combinedNames);
                setCaloriesBurned(totalCals.toString());
                setDurationMinutes(totalTime.toString());
            }
        } catch (error) {
            console.error("AI Failed", error);
            alert("AI could not understand that. Try being more specific.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 1. Send data to backend (Must match Model variable names!)
            await api.post('/exercises', { 
                activityName, 
                caloriesBurned: Number(caloriesBurned),
                durationMinutes: Number(durationMinutes)
            });

            // 2. Clear form
            setActivityName('');
            setCaloriesBurned('');
            setDurationMinutes('');
            setAiQuery('');//reset and close

            // 3. Close & Refresh
            onClose();
            onExerciseAdded(); 
        } catch (error) {
            console.error("Failed to add exercise", error);
            alert("Failed to add exercise");
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>🔥 Log Workout</h2>

                {/* --- AI SECTION --- */}
                <div style={styles.aiSection}>
                    <textarea 
                        placeholder="e.g. 'I ran for 20 mins and did 50 pushups'"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        style={styles.aiInput}
                    />
                    <button 
                        type="button" 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        style={styles.aiButton}
                    >
                        {isAnalyzing ? 'Thinking...' : '✨ AI Analyze'}
                    </button>
                </div>

                <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #eee' }} />

                {/* Standard Form (Pre-filled by AI) */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Activity</label>
                    <input 
                        type="text" 
                        placeholder="Activity Name" 
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    
                    <div style={{display: 'flex', gap: '1rem'}}>
                        <div style={{flex: 1}}>
                            <label style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Calories</label>
                            <input 
                                type="number" 
                                placeholder="Cals" 
                                value={caloriesBurned}
                                onChange={(e) => setCaloriesBurned(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={{flex: 1}}>
                            <label style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Minutes</label>
                            <input 
                                type="number" 
                                placeholder="Mins" 
                                value={durationMinutes}
                                onChange={(e) => setDurationMinutes(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.buttons}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
                        <button type="submit" style={styles.submitBtn}>Add Workout</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    },
    modal: {
        backgroundColor: 'white', padding: '2rem', borderRadius: '12px',
        width: '90%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    aiSection: { display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' },
    aiInput: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '60px', fontFamily: 'inherit' },
    aiButton: { padding: '0.5rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)', color: 'white', cursor: 'pointer', fontWeight: 'bold' as const },
    
    form: { display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' },
    input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '0.5rem', width: '100%', boxSizing: 'border-box' as const },
    buttons: { display: 'flex', gap: '1rem', marginTop: '1rem' },
    cancelBtn: { flex: 1, padding: '0.75rem', border: '1px solid #ccc', background: 'white', cursor: 'pointer', borderRadius: '8px' },
    submitBtn: { flex: 1, padding: '0.75rem', border: 'none', background: '#ffc107', color: 'black', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold' as const }
};

export default AddExerciseModal;