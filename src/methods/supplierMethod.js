
import { STATUS_CODES } from "../global/app-errors.js"
import { Staff } from "../models/Staff.js"
import { Supplier } from "../models/Supplier.js"

export const getAllSuppliers = async(req, res, next) => {
    try {
        const suppliers = await Supplier.find({})
            .select({__v:0, udatedAt: 0})

        res.status(200).json({status: true, message: 'Success', suppliers})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
    }
}


export const getSupplierByID = async (req, res, next) => {
    try {
        const { id } = req.params
        const supplier = await Supplier.findById(id)
            .select({__v:0, udatedAt: 0})

        res.status(200).json({status: true, message: 'Success', supplier})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
        
    }
}

export const createSupplier = async (req, res, next) => {
    try {
        const {user} = req
        const { supplierName, companyName, supplierEmail, supplierPhone, supplierAddress } = req.body

        const supplier = new Supplier({supplierName, companyName, supplierEmail, supplierPhone, supplierAddress})

        const error = supplier.validateSync()
        if(error) {
            
            return res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:`${error.message.split(':')[2].split(',')[0]}`, errorCode: STATUS_CODES.BAD_REQUEST})
        }

        if(req.body?._id) {
            const supplier = await Supplier.findByIdAndUpdate(req.body?._id, {$set:{...req.body}})
            return res.status(200).json({status: true, message: 'Success', supplier})
        }

        supplier.createdBy = user?._id

        await supplier.save()


        res.status(200).json({status: true, message: 'Success', supplier})
    } catch (error) {
        res.status(500).json({status: false, message: `Internal server error ${error}`})
        
    }
}