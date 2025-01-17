import jwt from 'jsonwebtoken'
import pkg from 'bcryptjs';
const {hashSync, compareSync} =  pkg
import { Staff } from "../models/Staff.js"
import { Store } from "../models/Store.js"
import { BadRequestError, STATUS_CODES } from '../global/app-errors.js'
import { isValidObjectId } from 'mongoose'
const saltRounds = 10

export const authenticatedUser = async(req, res, next) => {
    try {
        const {user} = req
        res.send({statusCode: 200, message: 'Success', user})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
    }
}




export const getUsers = async(req, res, next) => {
    try {
        const users = await Staff.find({})
            .select({__v:0, udatedAt: 0})
            .populate('store', {__v: 0, updatedAt: 0})
            .sort({updatedAt: -1})

        res.status(200).json({status: true, message: 'Success', users})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
    }
}


export const getUserByID = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await Staff.findById(id)
            .select({__v:0, udatedAt: 0})
            .populate('store', {__v: 0, updatedAt: 0})

        res.status(200).json({status: true, message: 'Success', user})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
        
    }
}



export const handleUserLogIn = async(req, res) => {
        
   try {
        const {username, password} = req.body
        
        if(!username || !password) return res.status(STATUS_CODES.BAD_REQUEST).json( {status:false, message:`Bad request`, errorCode: STATUS_CODES.BAD_REQUEST})

        const user = await Staff.findOne({username})

        
        if(!user) return res.status(STATUS_CODES.BAD_REQUEST) .json({status: false, message: `Invalid User Name Or Password`, errorCode:  STATUS_CODES.BAD_REQUEST})
        
        const match = compareSync(password, user?.password)
        
        if(!match) return res.status(STATUS_CODES.BAD_REQUEST) .json({status: false, message: `Invalid User Name Or Password`, errorCode:  STATUS_CODES.BAD_REQUEST})

        const token = jwt.sign(`${user._id}`, `SH455POS` )
        const data = {
            _id: user._id,
            role: user.role,
            username: user.username,
            token
        };
        res.status(200).json(data)
   } catch (error) {
    res.status(500).json({status: false, message: `Internal server error ${error}`})
   }
    
}

export const changePassword = async (req, res, next) => {
    try {
        const {userId, password, oldPassword, confirmPassword } = req.body
        if(password !== confirmPassword) return res.status(400).json({status: false, message: 'Password must match'})

        const user = await Staff.findById(userId)
        if(!user) return res.status(400).json({status: false, message: 'Invalid user'})

        const match = compareSync(oldPassword, user?.password)
        if(!match) return res.status(400).json({status: false, message: 'Invalid user'})
        
        const hashPwd = hashSync(password, saltRounds);
        

        user.password = hashPwd

        await user.save()

        res.status(201).json({status: true, message: `${user.fullName} password changed successful` })

    } catch (error) {
        res.status(500).json({status:false, message: 'Internal server error'})
    }


}



export const createUser = async (req, res, next) => {
    try {
       
        const { fullName, username, phoneNumber, emailAddress, password, role, store } = req.body

        if(!Object.keys({...req.body})) throw new BadRequestError()     
        
        if(!isValidObjectId(store)) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:`Invalid branch`, errorCode: STATUS_CODES.BAD_REQUEST})
        }
        const hashPWD = hashSync(password, saltRounds)

        const user = new Staff({fullName, username, phoneNumber, emailAddress, password:hashPWD, role, store})

        const error = user.validateSync()
        if(error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:`${error.message.split(':')[2].split(',')[0]}`, errorCode: STATUS_CODES.BAD_REQUEST})
        }

        if(req.body?._id) {
            const oldData = await Staff.findById(req.body?._id)
            const user = await Staff.findByIdAndUpdate(req.body?._id, {$set:{...req.body, password: password ? hashPWD : oldData?.password}})
            await Store.findByIdAndUpdate(store, {$addToSet:{staff: req.body?._id}})
            await Store.findByIdAndUpdate(store, {$addToSet:{staff: user._id}})

            return res.status(200).json({status: true, message: 'Success', user})

        }

        user.createdBy = req?.user?._id
       
        await user.save()



        await Store.findByIdAndUpdate(store, {$addToSet:{staff: user._id}})

        res.status(200).json({status: true, message: 'Success', user})
    } catch (error) {
        console.log(error)
        res.status(500).json({status: false, message: `Internal server error ${error}`})     
    }
}