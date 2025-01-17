
import jwt from 'jsonwebtoken'
import { STATUS_CODES } from '../global/app-errors.js';
import { Staff } from '../models/Staff.js';


export const requireToken = async (req, res, next) => {
    try {

        const { authorization } = req.headers;
        // console.log(authorization)

        
        if(!authorization){
            return res.status(401).send({
                status:false,
                message: 'You must be logged in'
            })
        }
        // console.log(authorization)
        const token = authorization.replace("Bearer ", "");

        const payLoad = jwt.verify(token, `SH455POS`)

        const user = await Staff.findById(payLoad)
            .select({nextKin: 0, password: 0, __v: 0, updatedAt: 0})
            .populate({
                path: 'store',
                select: {__v: 0, createdAt: 0},
                
            })
            
            // return res.send(user)

            if(!user) throw new AppError(STATUS_CODES.BAD_REQUEST,'Unauthorized', STATUS_CODES.UN_AUTHORISED)
            req.token = token
            req.user = user;

            next()
       
        
    } catch (error) {
        if(error.name == 'JsonWebTokenError') return res.status(401).send({status: false, message: 'Session Expired'})
        res.status(404).send({message: `Internal Server Error`})
    }
}

export const verifyAdmin = async (req, res, next) => {
    try {
        if(!req.user?.role == 'Admin') return res.status(403).send({message: `Not Authorized`})
            next()
    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}


export const requireUserToken = async (req, res, next) => {
    try {

        const { authorization } = req.headers;
        if(!authorization){
            return res.status(401).send({
                error: 'You must be logged in'
            })
        }
        const token = authorization.replace("Bearer ", "");

        const payLoad = jwt.verify(token, `SH455POS`)

        const user = await Staff.findById(payLoad)
            .select({ password: 0, __v: 0, updatedAt: 0})
            
            
            // return res.send(user)


            if(!user) throw new AppError(STATUS_CODES.BAD_REQUEST,'Unauthorized', STATUS_CODES.UN_AUTHORISED)
            req.token = token
            req.user = user;
            next()
       
        
    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}



