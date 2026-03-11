import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Auth context: poore app me user data share karne ke liye

interface User{
    _id:string;
    name:string;
    email:string;
    calorieGoal:number;
    streak:number;
}

interface AuthContextType {
    user:User | null;
    login:(token :string , userData:User)=>void;
    logout:()=>void;
    loading:boolean;
}

// context aur provider banaya
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}:{children: ReactNode})=>{
    const [user,setUser] = useState<User | null>(null);
    const [loading,setloading] = useState(true);

    // check karo agar user pehle se logged in hai
    useEffect(()=>{
        const checkLoggedIn = async()=>{
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if(token && userData){
                setUser(JSON.parse(userData));
            }
            setloading(false);
        };
        checkLoggedIn();
    },[]);

    // user login action
    const login = (token:string , userData:User)=>{
        localStorage.setItem('token',token);
        localStorage.setItem('user',JSON.stringify(userData));
        setUser(userData);
    };

    // user logout action
    const logout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// auth context hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};