import { STATUS_CODES } from "../global/app-errors.js"
import { Location } from "../models/Location.js"

export const getAllLocation = async(req, res, next) => {
    try {
        const locations = await Location.find({})
            .select({__v:0, udatedAt: 0})
            .sort({updatedAt: -1})
            // .populate('createdBy', {__v: 0, updatedAt: 0})

        res.status(200).json({status: true, message: 'Success', locations})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
    }
}


export const getLocationByID = async (req, res, next) => {
    try {
        const { id } = req.params
        const location = await Location.findById(id)
            .select({__v:0, udatedAt: 0})
            .populate('createdBy', {__v: 0, updatedAt: 0})

        res.status(200).json({status: true, message: 'Success', location})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
        
    }
}

export const createLocation = async (req, res, next) => {
    try {
        const { locationName } = req.body

        const location = new Location({locationName})
        const error = location.validateSync()
        if(error) {
            
            return res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:`${error.message.split(':')[2].split(',')[0]}`, errorCode: STATUS_CODES.BAD_REQUEST})
        }

        if(req.body?._id) {
            const location = await Location.findByIdAndUpdate(req.body?._id, {$set:{...req.body}})
            return res.status(200).json({status: true, message: 'Success', location})
        }
        await location.save()

        res.status(200).json({status: true, message: 'Success', location})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
        
    }
}