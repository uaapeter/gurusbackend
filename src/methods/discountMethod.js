
import { STATUS_CODES } from "../global/app-errors.js"
import { Discount } from "../models/Discount.js"

export const getAllDiscount = async(req, res, next) => {
    try {
        const discounts = await Discount.find({})
            .select({__v:0, udatedAt: 0})
            .sort({updatedAt: -1})
        res.status(200).json({status: true, message: 'Success', discounts})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
    }
}

export const getDiscountByID = async (req, res, next) => {
    try {
        const { id } = req.params
        const discount = await Discount.findById(id)
            .select({__v:0, udatedAt: 0})
        res.status(200).json({status: true, message: 'Success', discount})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
        
    }
}

export const createDiscount = async (req, res, next) => {
    try {
        const {user} = req
        const { discountName, discountValue, status } = req.body

        const discount = new Discount({discountName, discountValue, status})

        const error = discount.validateSync()
        if(error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:`${error.message.split(':')[2].split(',')[0]}`, errorCode: STATUS_CODES.BAD_REQUEST})
        }

        if(req.body?._id) {
            const discount = await Discount.findByIdAndUpdate(req.body?._id, {$set:{...req.body}})
            return res.status(200).json({status: true, message: 'Success', discount})
        }

        discount.createdBy = user?._id

        await discount.save()


        res.status(200).json({status: true, message: 'Success', discount})
    } catch (error) {
        res.status(500).json({status: false, message: `Internal server error ${error}`})
        
    }
}