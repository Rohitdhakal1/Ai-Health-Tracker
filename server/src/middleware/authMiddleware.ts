import { Response,Request, NextFunction } from "express";
import jwt  from "jsonwebtoken";
import User from "../models/User";

interface AuthRequest extends Request{
    user?:any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction)=>{
  let token: string | undefined;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try {
        // 2. Get the token (remove "Bearer " string)
        token = req.headers.authorization.split(' ')[1];
        if (!token) {
                 res.status(401).json({ message: 'Not authorized, no token found' });
                 return; // Stop execution
            }
       // 3. Verify the token using our secret
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        // 4. Find the user in DB (exclude password) and attach to req
       req.user= await User.findById(decoded.id).select('-password');
       // 5. Allow request to move to the next step
       next();
    } catch (error) {
        console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  else {
        // If there is no header, we MUST tell the user "No"
        res.status(401).json({ message: 'Not authorized, no token' });
    }
  
};
