
import { STATUS_CODES } from "../global/app-errors.js"
import { Category } from "../models/Category.js"

export const getAllCategories= async(req, res, next) => {
    try {
        const categories = await Category.find({})
            .select({__v:0, udatedAt: 0})
            .sort({updatedAt: -1})

        res.status(200).json({status: true, message: 'Success', categories})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
    }
}


export const getCategoryByID = async (req, res, next) => {
    try {
        const { id } = req.params
        const category = await Category.findById(id)
            .select({__v:0, udatedAt: 0})

        res.status(200).json({status: true, message: 'Success', category})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
        
    }
}

export const createCategory = async (req, res, next) => {
    try {
        const {user} = req
        const { categoryName } = req.body

        const category = new Category({categoryName})

        const error = category.validateSync()
        if(error) {
            
            return res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:`${error.message.split(':')[2].split(',')[0]}`, errorCode: STATUS_CODES.BAD_REQUEST})
        }

        if(req.body?._id) {
            const category = await Category.findByIdAndUpdate(req.body?._id, {$set:{...req.body}})
            return res.status(200).json({status: true, message: 'Success', category})
        }

        category.createdBy = user?._id

        await category.save()


        res.status(200).json({status: true, message: 'Success', category})
    } catch (error) {
        res.status(500).json({status: false, message: `Internal server error ${error}`})
        
    }
}