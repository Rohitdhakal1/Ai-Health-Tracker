import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "../services/api";

//API: We built a pipe that connects React to Node.
// Context: We built a "cloud" over our app that holds the User Data.
// Persistence: If you refresh the page, the useEffect in Step 2 reads 
// localStorage and keeps you logged in.


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


// create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//2 . create the provider component 
export const AuthProvider = ({children}:{children: ReactNode})=>{
    const [user,setUser] = useState<User | null>(null);
    const [loading,setloading] = useState(true);

    //on load check if user is already logged in from (from localstorage)
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



    //login action 
    const login = (token:string , userData:User)=>{
        localStorage.setItem('token',token);
        localStorage.setItem('user',JSON.stringify(userData));
        setUser(userData);
    };


    //logout action
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

// 4. Custom Hook for easy access
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};