import { STATUS_CODES } from "../global/app-errors.js"
import { Staff } from "../models/Staff.js"
import { Store } from "../models/Store.js"

export const getAllStores = async(req, res, next) => {
    try {
        const stores = await Store.find({})
            .select({__v:0, udatedAt: 0})
            .populate('manager', {__v: 0, updatedAt: 0})
            .populate('location', {__v: 0, updatedAt: 0})
            .sort({updatedAt: -1})


        res.status(200).json({status: true, message: 'Success', stores})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
    }
}


export const getStoreByID = async (req, res, next) => {
    try {
        const { id } = req.params
        const store = await Store.findById(id)
            .select({__v:0, udatedAt: 0})
            .populate('manager', {__v: 0, updatedAt: 0})
            .populate('location', {__v: 0, updatedAt: 0})

        res.status(200).json({status: true, message: 'Success', store})
    } catch (error) {
        res.status(500).json({status: false, message: 'Internal server error'})
        
    }
}

export const createStore = async (req, res, next) => {
    try {
        const {user} = req
        const { storeName, manager, location, storePhone, status, storeAddress, storeEmail } = req.body


        const store = new Store({storeName, manager, location, storePhone, status, storeAddress, storeEmail})


        const error = store.validateSync()
        if(error) {
            
            return res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:`${error.message.split(':')[2].split(',')[0]}`, errorCode: STATUS_CODES.BAD_REQUEST})
        }


        if(req.body?._id) {
            const store = await Store.findByIdAndUpdate(req.body?._id, {$set:{...req.body}})
            await Store.findByIdAndUpdate(store, {$addToSet:{staff: req.body?._id}})

            await Staff.findByIdAndUpdate(manager, {$set: {role: manager ? 'Admin': 'Cashier'}})
            return res.status(200).json({status: true, message: 'Success', store})
        }

        store.createdBy = user?._id

        await store.save()


        await Staff.findByIdAndUpdate(manager, {$set: {role: manager ? 'Admin': 'Cashier'}})

        res.status(200).json({status: true, message: 'Success', store})
    } catch (error) {
        res.status(500).json({status: false, message: `Internal server error ${error}`})
        
    }
}