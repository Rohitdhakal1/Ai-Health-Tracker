import { useState } from 'react';
import api from '../services/api';

interface Props {
    isOpen: boolean;           // Should we show it?
    onClose: () => void;       // Function to close it
    onFoodAdded: () => void;   // Function to refresh the dashboard
}

const AddFoodModal = ({isOpen , onClose , onFoodAdded}: Props)=>{

    // Local state for the form
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');

    // --- NEW: AI STATE ---
    const [aiQuery, setAiQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);


    // If isOpen is false, return null (render nothing)
    if (!isOpen) return null;


    // --- NEW: THE MAGIC FUNCTION ---
    const handleAnalyze = async () => {
        if (!aiQuery) return;
        
        setIsAnalyzing(true);
        try {
            // 1. Send text to your new Backend Route
            const { data } = await api.post('/ai/food', { text: aiQuery });

            // 2. The AI returns an Array (e.g., Burger + Fries)
            // We will sum them up to make it simple for the user
            if (data && data.length > 0) {
                const totalCals = data.reduce((acc: number, item: any) => acc + item.calories, 0);
                const combinedNames = data.map((item: any) => item.name).join(' & ');

                // 3. AUTO-FILL THE FORM
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
            //1. send data to backened
            await api.post('/foods',{
                name,
                calories:Number(calories)
            });

            //2. clear Form //reset or close 
            setName('');
            setCalories('');

            setAiQuery(''); // Clear AI text too

            //3. close modal
            onClose();

            // 4. Tell Dashboard to refresh
            onFoodAdded();

        } catch (error) {
            console.error("Failed to add food", error);
            alert("Failed to add food");
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>🍎 Log Meal</h2>

                {/* --- NEW: AI INPUT SECTION --- */}
                <div style={styles.aiSection}>
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
                    >
                        {isAnalyzing ? 'Thinking...' : '✨ AI Analyze'}
                    </button>
                </div>

                <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #eee' }} />

                {/* Standard Form (Pre-filled by AI) */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Food Name</label>
                    <input 
                        type="text" 
                        placeholder="Food Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    
                    <label style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Calories</label>
                    <input 
                        type="number" 
                        placeholder="Calories" 
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        style={styles.input}
                        required
                    />

                    <div style={styles.buttons}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
                        <button type="submit" style={styles.submitBtn}>Save Food</button>
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
    // New Styles for AI
    aiSection: { display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' },
    aiInput: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '60px', fontFamily: 'inherit' },
    aiButton: { padding: '0.5rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', cursor: 'pointer', fontWeight: 'bold' as const },
    
    form: { display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' },
    input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '0.5rem' },
    buttons: { display: 'flex', gap: '1rem', marginTop: '1rem' },
    cancelBtn: { flex: 1, padding: '0.75rem', border: '1px solid #ccc', background: 'white', cursor: 'pointer', borderRadius: '8px' },
    submitBtn: { flex: 1, padding: '0.75rem', border: 'none', background: '#28a745', color: 'white', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold' as const }
};

export default AddFoodModal;