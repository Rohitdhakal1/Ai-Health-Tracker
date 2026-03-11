import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import AddFoodModal from "../components/AddFoodModal";
import AddExerciseModal from "../components/AddExerciseModal";

interface FoodItem {
  _id: string;
  name: string;
  calories: number;
}
interface ExerciseItem {
  _id: string;
  activityName: string;
  caloriesBurned: number;
}

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  // dashboard data fetch karne ka function
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const foodRes = await api.get("/foods");
      const exerciseRes = await api.get("/exercises");
      setFoods(foodRes.data);
      setExercises(exerciseRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // metrics calculation
  const totalFood = foods.reduce((acc, item) => acc + item.calories, 0);
  const totalExercise = exercises.reduce(
    (acc, item) => acc + item.caloriesBurned,
    0
  );
  const goal = user?.calorieGoal || 2000;
  const remaining = goal + totalExercise - totalFood;

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={styles.container} className="fade-in">
      {/* ... Header and Stats Grid (Same as before) ... */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Hello, {user?.name}</h1>
          <p style={{ color: "var(--primary)", fontWeight: 600, marginTop: "8px", fontSize: "0.9375rem" }}>
            {user?.streak || 0} Day Streak
          </p>
        </div>
        <button onClick={logout} style={styles.logoutBtn} className="hover-lift">
          Logout
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={{ ...styles.card, borderLeft: "4px solid var(--accent-secondary)" }} className="card-lift">
          <p style={styles.cardLabel}>Goal</p>
          <p style={styles.bigNumber}>{goal}</p>
        </div>
        <div style={{ ...styles.card, borderLeft: "4px solid var(--accent-soft)" }} className="card-lift">
          <p style={styles.cardLabel}>Food (In)</p>
          <p style={styles.bigNumber}>{totalFood}</p>
        </div>
        <div style={{ ...styles.card, borderLeft: "4px solid var(--primary)" }} className="card-lift">
          <p style={styles.cardLabel}>Exercise (Out)</p>
          <p style={styles.bigNumber}>{totalExercise}</p>
        </div>
        <div style={{ ...styles.card, borderLeft: "4px solid var(--accent-secondary)" }} className="card-lift">
          <p style={styles.cardLabel}>Remaining</p>
          <p style={styles.bigNumber}>{remaining}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div style={styles.contentGrid}>
        {/* Food Section */}
        <div style={styles.listCard} className="card-lift">
          <h2 style={styles.listTitle}>Meals Today</h2>
          <ul style={styles.list}>
            {foods.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontStyle: "italic" }}>No meals logged yet today.</p>
            ) : (
              foods.map((f) => (
                <li key={f._id} style={styles.listItem} className="dashboard-list-item">
                  <span style={styles.foodName}>{f.name}</span>
                  <span style={styles.foodCals}>{f.calories} cal</span>
                </li>
              ))
            )}
          </ul>

          <button
            onClick={() => setIsFoodModalOpen(true)}
            style={styles.addBtn}
            className="hover-lift"
          >
            Log Meal
          </button>
        </div>

        {/* Exercise Section */}
        <div style={styles.listCard} className="card-lift">
          <h2 style={styles.listTitle}>Workouts Today</h2>
          <ul style={styles.list}>
            {exercises.length === 0 ? (
               <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontStyle: "italic" }}>No workouts logged yet today.</p>
            ) : (
              exercises.map((e) => (
                <li key={e._id} style={styles.listItem} className="dashboard-list-item">
                  <span style={styles.foodName}>{e.activityName}</span>
                  <span style={styles.foodCals}>{e.caloriesBurned} cal</span>
                </li>
              ))
            )}
          </ul>
          <button
            style={{ ...styles.addBtn, background: "var(--primary)", boxShadow: "0 10px 15px -3px rgba(243, 186, 96, 0.3)" }}
            onClick={() => setIsExerciseModalOpen(true)}
            className="hover-lift"
          >
            Log Workout
          </button>
        </div>
      </div>

      {/* food and exercise modals */}
      <AddFoodModal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        onFoodAdded={fetchDashboardData} // <--- Pass the refresh function!
      />

      <AddExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onExerciseAdded={fetchDashboardData}
      />
    </div>
  );
};

// dashboard styling
const styles = {
  container: { 
    maxWidth: "1200px", 
    margin: "0 auto", 
    padding: "2.5rem 1.5rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid var(--accent-soft)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "var(--text-main)",
    letterSpacing: "-0.03em",
    margin: 0,
  },
  logoutBtn: {
    padding: "8px 16px",
    background: "transparent",
    color: "var(--text-muted)",
    border: "1px solid var(--accent-secondary)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: 600,
    transition: "var(--transition)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.25rem",
    marginBottom: "5rem",
  },
  card: {
    background: "var(--card-bg)",
    padding: "1.5rem 2rem",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    border: "1px solid var(--accent-soft)",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: "0.6875rem",
    fontWeight: 800,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.075em",
    marginBottom: "0.125rem",
  },
  bigNumber: { 
    fontSize: "3.25rem", 
    fontWeight: 900, 
    margin: 0,
    color: "var(--text-main)",
    letterSpacing: "-0.06em",
    lineHeight: 1,
  },
  contentGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
    gap: "2.5rem" 
  },
  listCard: {
    background: "var(--card-bg)",
    padding: "2.5rem",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid var(--accent-soft)",
  },
  listTitle: {
    fontSize: "1.375rem",
    fontWeight: 800,
    marginBottom: "2rem",
    color: "var(--text-main)",
    letterSpacing: "-0.02em",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  list: { 
    listStyle: "none", 
    padding: 0, 
    margin: 0,
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "12px",
    backgroundColor: "var(--bg)",
    transition: "var(--transition)",
    border: "1px solid transparent",
  },
  foodName: {
    fontWeight: 600,
    color: "var(--text-main)",
    fontSize: "0.9375rem",
  },
  foodCals: {
    backgroundColor: "white",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "var(--text-muted)",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    border: "1px solid var(--accent-soft)",
  },
  addBtn: {
    width: "100%",
    padding: "14px",
    marginTop: "2rem",
    background: "var(--primary)",
    color: "var(--text-main)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "0.9375rem",
    fontWeight: 700,
    letterSpacing: "0.01em",
    boxShadow: "0 10px 15px -3px rgba(243, 186, 96, 0.2), 0 4px 6px -2px rgba(243, 186, 96, 0.1)",
  },
};

export default Dashboard;
