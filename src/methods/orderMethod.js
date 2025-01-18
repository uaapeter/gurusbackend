import { STATUS_CODES } from "../global/app-errors.js"
import { Order } from "../models/Order.js"
import { Orderitem } from "../models/OrderItems.js";
import { Product } from "../models/Product.js";

let start = new Date();
start.setHours(0,0,0,0)

export const getSalesOrders = async (req, res) => {
    try {
        const {_id, role } = req.user

        if(role !== 'Admin') {
            const orders = await Order.find({orderType: 'SALE', cashier: _id})
            .populate('cashier', {__v: 0, password: 0, updatedAt: 0})
            .populate({
                path: 'orderItems',
                selected: {__v: 0, updatedAt: 0},
                populate: {
                    path: 'product',
                    selected: {__v: 0, updatedAt: 0}
                }
            }).sort({updatedAt: -1})

            return res.send({message: 'success', orders})
        }

        const orders = await Order.find({orderType: 'SALE'})
            .populate({
                path: 'orderItems',
                selected: {__v: 0, updatedAt: 0},
                populate: {
                    path: 'product',
                    selected: {__v: 0, updatedAt: 0}
                }
            }).sort({updatedAt: -1})
            .populate('cashier', {__v: 0, password: 0, updatedAt: 0})
        return res.send({message: 'success', orders})

    } catch (error) {
        return res.status(500).json({status: false, errorCode: 500, message: `Internal server error ${error}`})
    }
}

export const getSalesOrdersUnPaid = async (req, res) => {
    try {
        const {_id, role } = req.user

        if(role !== 'Admin') {
            const orders = await Order.find({orderType: 'SALE', cashier: _id, status: 'Open'})
            .populate('cashier', {__v: 0, password: 0, updatedAt: 0})
            .populate({
                path: 'orderItems',
                selected: {__v: 0, updatedAt: 0},
                populate: {
                    path: 'product',
                    selected: {__v: 0, updatedAt: 0}
                }
            }).sort({updatedAt: -1})

            return res.send({message: 'success', orders})
        }

        const orders = await Order.find({orderType: 'SALE', status: 'Open'})
            .populate({
                path: 'orderItems',
                selected: {__v: 0, updatedAt: 0},
                populate: {
                    path: 'product',
                    selected: {__v: 0, updatedAt: 0}
                }
            }).sort({updatedAt: -1})
            .populate('cashier', {__v: 0, password: 0, updatedAt: 0})
        return res.send({message: 'success', orders})

    } catch (error) {
        return res.status(500).json({status: false, errorCode: 500, message: `Internal server error ${error}`})
    }
}


export const getCurrentSalesOrders = async (req, res) => {
    try {
        const {_id, role } = req.user

        if(role !== 'Admin') {
            const orders = await Order.find({orderType: 'SALE', cashier: _id, createdAt: {
                $gte: start
            }})
            .populate('cashier', {__v: 0, password: 0, updatedAt: 0})
            .populate({
                path: 'orderItems',
                selected: {__v: 0, updatedAt: 0},
                populate: {
                    path: 'product',
                    selected: {__v: 0, updatedAt: 0}
                }
            }).sort({updatedAt: -1})

            return res.send({message: 'success', orders})
        }

        const orders = await Order.find({orderType: 'SALE', createdAt: { $gte: start}})
            .populate('cashier', {__v: 0, password: 0, updatedAt: 0})
            .populate({
                path: 'orderItems',
                selected: {__v: 0, updatedAt: 0},
                populate: {
                    path: 'product',
                    selected: {__v: 0, updatedAt: 0}
                }
            }).sort({updatedAt: -1})
        return res.send({message: 'success', orders})

    } catch (error) {
        return res.status(500).json({status: false, errorCode: 500, message: `Internal server error ${error}`})
    }
}

export const getSavedOrders = async (req, res) => {
    try {
        const {_id, role } = req.user

        if(role !== 'Admin') {
            const orders = await Order.find({orderType: 'SALE', paymentMethod: 'Pending', cashier: _id})
            .populate('cashier', {__v: 0, password: 0, updatedAt: 0})
            .populate({
                path: 'orderItems',
                selected: {__v: 0, updatedAt: 0},
                populate: {
                    path: 'product',
                    selected: {__v: 0, updatedAt: 0}
                }
            }).sort({updatedAt: -1})

            return res.send({message: 'success', orders})
        }

        const orders = await Order.find({orderType: 'SALE', paymentMethod: 'Pending'})
            .populate('cashier', {__v: 0, password: 0, updatedAt: 0})
            .populate({
                path: 'orderItems',
                selected: {__v: 0, updatedAt: 0},
                populate: {
                    path: 'product',
                    selected: {__v: 0, updatedAt: 0}
                }
            }).sort({updatedAt: -1})
        return res.send({message: 'success', orders})

    } catch (error) {
        return res.status(500).json({status: false, errorCode: 500, message: `Internal server error ${error}`})
    }
}


export const getAllOrderItems = async (req, res) => {
    try {
        const items = await Orderitem.find({})
        res.send(items)
    } catch (error) {
        return res.status(500).json({status: false, errorCode: 500, message: `Internal server error`})
    }
}


export const removeOrderItem = async (req, res, next) => {
    try {
        const { orderRow } = req.params;

        await Orderitem.deleteOne({orderRow})
        res.send({status: true, message: `Row Removed`})
    } catch (error) {
        return res.status(500).json({status: false, errorCode: 500, message: `Internal server error`})
    }
}

export const removeOrder = async (req, res) => {
    try {
        const {orderId} = req.params;
        await Order.findOneAndUpdate({orderId}, {$set: {status: 'Void'}})

        await Orderitem.updateMany({orderId}, {$set: {status: 'Void'}})
        res.status(201).json({status: true, message:`${orderId} Order deleted successful`})
    } catch (error) {
        return res.status(500).json({status: false, errorCode: 500, message: `Internal server error`})
    }
}

async function handleUpdateProduct(id, type, qty) {

    const product = await Product.findByIdAndUpdate(id);

    return await product.updateQty(id, type, qty)
    
}


async function handleUpdateOrderItem(item, next) {
    try {
        const { quantity, orderType, product, orderRow, orderId } = item;

        const orderItem = await Orderitem.findOne({orderRow})

        if(orderItem) {

            const qty = quantity > orderItem?.quantity ? quantity - orderItem?.quantity : quantity < orderItem.quantity ? orderItem.quantity - quantity : 0;
            const type = orderType == 'PURCHASE' && quantity < orderItem?.quantity ? 'SALE' : orderType; 

            await Orderitem.findOneAndUpdate({orderRow}, {...item}, {upsert:true});

            return handleUpdateProduct(product, type, qty);
        }

       await Orderitem.findOneAndUpdate({orderRow}, {...item}, {upsert:true});
       const newitem = await Orderitem.findOne({orderRow})
       await Order.findOneAndUpdate({orderId}, {$addToSet: {orderItems: newitem?._id}})


        await handleUpdateProduct(product, orderType, quantity)


    } catch (error) {
       next(error)
    }
}

export const placeOrder = async (req, res, next) => {
    try {
        // console.log(req.body)
        const {user} = req
        const cashier = user?._id
        const { orderId, status, orderType, paymentMethod, customer, amount, discount, totalPaid, VALUES } = req.body
        const orderOn = new Date().toISOString()
        if(!orderType || !customer || !cashier || !amount || !VALUES?.length > 0) return res.status(STATUS_CODES.BAD_REQUEST).json({status: false, errorCode: STATUS_CODES.BAD_REQUEST, message: `Invalid request`})
        const newOrder = new Order({orderId, status, orderOn, discount, orderType, customer,  cashier, amount, totalPaid, paymentMethod})
        
        const error = newOrder.validateSync()
        if(error && error.message) return res.status(STATUS_CODES.BAD_REQUEST).json({status: false, errorCode: STATUS_CODES.BAD_REQUEST, message: error.message.split(':')[2].split(',')[0]});

        await Order.findOneAndUpdate({orderId}, {
                orderId, status, orderOn, orderType, customer, cashier, amount, discount, totalPaid, paymentMethod
            },
            {
                upsert:true
            }
        )

        VALUES.flatMap( async item => {
           await handleUpdateOrderItem(item, next)
        });

        setTimeout( async() => {
            const order = await Order.findOne({orderId})
            .populate({
                path: 'orderItems',
                selected: {__v: 0, updatedAt: 0},
                populate: {
                    path: 'product',
                    selected: {__v: 0, updatedAt: 0}
                }
            })
                .populate('cashier', {__v: 0, password: 0})

            res.status(STATUS_CODES.OK).json({status: true, errorCode: STATUS_CODES.OK, message: `Order successful`, order})
        }, 3000);

    } catch (error) {
       
        return res.status(500).json({status: false, errorCode: 500, message: `Internal server error`})
    }
}