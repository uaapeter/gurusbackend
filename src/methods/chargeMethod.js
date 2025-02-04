
import { STATUS_CODES } from "../global/app-errors.js"
import { Charge } from "../models/Charge.js"

export const getAllCharges = async(req, res, next) => {
    try {
        const charges = await Charge.find({})
            .select({__v:0, udatedAt: 0})
            .sort({updatedAt: -1})
        res.status(200).json({status: true, message: 'Success', charges})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
    }
}

export const getChargeByID = async (req, res, next) => {
    try {
        const { id } = req.params
        const charge = await Charge.findById(id)
            .select({__v:0, udatedAt: 0})
        res.status(200).json({status: true, message: 'Success', charge})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
        
    }
}

export const createCharge = async (req, res, next) => {
    try {
        const {user} = req
        const { chargeName, chargeValue, status } = req.body

        const charge = new Charge({chargeName, chargeValue, status})

        const error = charge.validateSync()
        if(error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:`${error.message.split(':')[2].split(',')[0]}`, errorCode: STATUS_CODES.BAD_REQUEST})
        }

        if(req.body?._id) {
            const charge = await Charge.findByIdAndUpdate(req.body?._id, {$set:{...req.body}})
            return res.status(200).json({status: true, message: 'Edited Success', charge})
        }

        charge.createdBy = user?._id

        await charge.save()


        res.status(200).json({status: true, message: `${chargeName} Created successful`, charge})
    } catch (error) {
        res.status(500).json({status: false, message: `Internal server error ${error}`})
        
    }
}