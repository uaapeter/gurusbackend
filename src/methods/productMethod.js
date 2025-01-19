import { isValidObjectId } from "mongoose";
import { STATUS_CODES } from "../global/app-errors.js"
import { Category } from "../models/Category.js"
import { Product } from "../models/Product.js"
import { Store } from "../models/Store.js"

let start = new Date();
start.setHours(0,0,0,0)

export const getAllProducts = async(req, res, next) => {
    try {
        const {role, store} = req.user

        if(role !== 'Admin') {
            const products = await Product.find({store})
                .select({__v:0, udatedAt: 0})
                .populate('store', {__v: 0, updatedAt: 0})
                .populate('category', {__v: 0, updatedAt: 0})
                .populate('supplier', {__v: 0, updatedAt: 0})
                .sort({updatedAt: -1})


            return res.status(200).json({status: true, message: 'Success', products})
        }

        const products = await Product.find({})
            .select({__v:0, udatedAt: 0})
            .populate('store', {__v: 0, updatedAt: 0})
            .populate('category', {__v: 0, updatedAt: 0})
            .populate('supplier', {__v: 0, updatedAt: 0})
            .sort({updatedAt: -1})


        return res.status(200).json({status: true, message: 'Success', products})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
    }
}


export const getProductByID = async (req, res, next) => {
    try {
        const { id } = req.params 
        const product = await Product.findById(id)
            .select({__v:0, udatedAt: 0})
            .populate('store', {__v: 0, updatedAt: 0})
            .populate('category', {__v: 0, updatedAt: 0})
            .populate('supplier', {__v: 0, updatedAt: 0})

        res.status(200).json({status: true, message: 'Success', product})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
        
    }
}


export const getProductsExpired = async (req, res, next) => {
    try {
        const { query } = req.params

       if(query == 0) {
            const products = await Product.find({expireDate: {$lte: start}})
                .select({__v:0, udatedAt: 0})
                .populate('store', {__v: 0, updatedAt: 0})
                .populate('category', {__v: 0, updatedAt: 0})
                .populate('supplier', {__v: 0, updatedAt: 0})


            return res.status(200).json({status: true, message: 'Success', products})
       }

       return res.status(200).json({status: true, message: 'Success', products:[]})

    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
        
    }
}


export const createProduct= async (req, res, next) => {
    try {
        const {user} = req
        const { barcode, productBatch, productName, productDescription, costPrice, sellingPrice, cartonQty, supplier, category, store, mftDate, expireDate } = req.body
        if(!isValidObjectId(category)) return res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message: 'Invalid category'})
        if(!isValidObjectId(store)) return res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message: 'Invalid Store'})

        if(!isValidObjectId(supplier)) return res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message: 'Invalid Supplier'})


        const product = new Product({barcode, productBatch, productName, productDescription, costPrice, sellingPrice, cartonQty, supplier, category, store, mftDate, expireDate})

        const error = product.validateSync()
        if(error) {
            
            return res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:`${error.message.split(':')[2].split(',')[0]}`, errorCode: STATUS_CODES.BAD_REQUEST})
        }


        if(req.body?._id) {
            const oldp = await Product.findById(req.body?._id)
            const product = await Product.findByIdAndUpdate(req.body?._id, {$set:{...req.body, expireDate: expireDate?expireDate: oldp.expireDate, 
                mftDate: mftDate? mftDate : oldp?.mftDate
             }})
            await Store.findByIdAndUpdate(store, {$addToSet:{products: req.body?._id}})
            await Category.findByIdAndUpdate(category, {$addToSet:{products: req.body?._id}})

            
            return res.status(200).json({status: true, message: 'Success', product})
        }

        product.createdBy = user?._id

        await product.save()

        await Category.findByIdAndUpdate(category, {$addToSet:{products: product._id}})
        await Store.findByIdAndUpdate(store, {$addToSet:{products: product._id}})


        

        res.status(200).json({status: true, message: 'Success', product})
    } catch (error) {
        res.status(500).json({status: false, message: `Internal server error ${error}`})
        
    }
}
