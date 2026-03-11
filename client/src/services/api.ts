import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// axios setup with auth interceptor
const api = axios.create({
    baseURL:baseURL,
    headers:{
        'Content-Type':'application/json'
    }
});

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config;
    },
    (error)=>Promise.reject(error)
);

export default api;
