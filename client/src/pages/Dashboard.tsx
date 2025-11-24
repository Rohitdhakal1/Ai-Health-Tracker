import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
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

  // Data State
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);

  // UI State
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false); // <--- STATE 2

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  // 3. Define Fetch function so we can reuse it
  const fetchDashboardData = async () => {
    try {
      const foodRes = await api.get("/foods");
      const exerciseRes = await api.get("/exercises");
      setFoods(foodRes.data);
      setExercises(exerciseRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculations
  const totalFood = foods.reduce((acc, item) => acc + item.calories, 0);
  const totalExercise = exercises.reduce(
    (acc, item) => acc + item.caloriesBurned,
    0
  );
  const goal = user?.calorieGoal || 2000;
  const remaining = goal + totalExercise - totalFood;

  return (
    <div style={styles.container}>
      {/* ... Header and Stats Grid (Same as before) ... */}
      <div style={styles.header}>
        <h1>Hello, {user?.name} 👋</h1>
        {/* STREAK BADGE */}
        <p style={{ color: "#ff5722", fontWeight: "bold", marginTop: "5px" }}>
          🔥 {user?.streak || 0} Day Streak
        </p>
        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={{ ...styles.card, borderLeft: "5px solid #007bff" }}>
          <h3>Goal</h3>
          <p style={styles.bigNumber}>{goal}</p>
        </div>
        <div style={{ ...styles.card, borderLeft: "5px solid #28a745" }}>
          <h3>Food (In)</h3>
          <p style={styles.bigNumber}>{totalFood}</p>
        </div>
        <div style={{ ...styles.card, borderLeft: "5px solid #ffc107" }}>
          <h3>Exercise (Out)</h3>
          <p style={styles.bigNumber}>{totalExercise}</p>
        </div>
        <div style={{ ...styles.card, borderLeft: "5px solid #dc3545" }}>
          <h3>Remaining</h3>
          <p style={styles.bigNumber}>{remaining}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div style={styles.contentGrid}>
        {/* Food Section */}
        <div style={styles.listCard}>
          <h2>🍽️ Meals Today</h2>
          <ul style={styles.list}>
            {foods.map((f) => (
              <li key={f._id} style={styles.listItem}>
                <span>{f.name}</span>
                <strong>{f.calories} cal</strong>
              </li>
            ))}
          </ul>

          {/* THE BUTTON TO OPEN MODAL */}
          <button
            onClick={() => setIsFoodModalOpen(true)}
            style={styles.addBtn}
          >
            + Log Meal
          </button>
        </div>

        {/* Exercise Section (Placeholder for now) */}
        <div style={styles.listCard}>
          <h2>🔥 Workouts Today</h2>
          <ul style={styles.list}>
            {exercises.map((e) => (
              <li key={e._id} style={styles.listItem}>
                <span>{e.activityName}</span>
                <strong>{e.caloriesBurned} cal</strong>
              </li>
            ))}
          </ul>
          <button
            style={styles.addBtn}
            onClick={() => setIsExerciseModalOpen(true)}
          >
            + Log Workout
          </button>
        </div>
      </div>

      {/* THE MODAL COMPONENT */}
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

// ... Styles (Same as before) ...
const styles = {
  container: { maxWidth: "1000px", margin: "0 auto", padding: "2rem" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  logoutBtn: {
    padding: "8px 16px",
    background: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  card: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  bigNumber: { fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0" },
  contentGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" },
  listCard: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  list: { listStyle: "none", padding: 0 },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    borderBottom: "1px solid #eee",
  },
  addBtn: {
    width: "100%",
    padding: "10px",
    marginTop: "1rem",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default Dashboard;
