import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// create axios instance
const api = axios.create({
    baseURL:baseURL,
    headers:{
        'Content-Type':'application/json'
    }
})// this means baseURL: 'http://localhost:5000/api'
// Every request you make with api will automatically start with this URL.
// with this URL.
// So:
// api.get("/users");
// Actually sends a request to:
// http://localhost:5000/api/users
// You don't need to write the full URL every time.


api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config;
    },
    (error)=>Promise.reject(error)
);  // Interceptor does not contain body but its a middlware run before axios.
// It modifies the request before sending it.
// Example: You can add or change:
// headers , method ,url, body (req.data)
// params (req.params) ,But it does not automatically provide the body — it just edits the request you created.

export default api;

