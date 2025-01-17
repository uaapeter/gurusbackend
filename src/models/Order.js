import { GLOBAL } from "../global/index.js";

const orderSchema = new GLOBAL.Schema({
    orderId: {
        type: String,
        unique: true,
        set: e => e.toString()
    },

    orderOn: {
        type: Date,
        required: [true, 'Order date is required']
    },
    orderType: {
        type: String,
        default: 'SALE',
        enum: ['PURCHASE', 'SALE']
    },
    status: {
        type: String,
        enum: ['Open', 'Paid']
    },
    customer: Object,
    cashier: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'staff'
    },
    amount: Number,
    totalPaid: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        default: 'Pending',
        enum: ['Cash', 'POS', 'Transfer', 'Pending']
    },
    orderItems: [{
        type: GLOBAL.Schema.Types.ObjectId, ref: 'orderitem'
    }],
    deleted: Boolean
}, {
    timestamps: true
})

export const Order = GLOBAL.model('order', orderSchema)