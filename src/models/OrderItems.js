import { GLOBAL } from "../global/index.js";

const orderItemSchema = new GLOBAL.Schema({
    orderRow: {
        type: String,
        unique: true
    },
    orderId: {
        type: String,
        set: e => e.toString()
    },

    orderType: {
        type: String,
        default: 'SALE',
        enum: ['PURCHASE', 'SALE']
    },
    productBatch: String,
    product: {
        type: GLOBAL.Schema.Types.ObjectId, ref:'product'
    },
    quantity: Number,
    amount: Number,
    discount: Number,
    total: Number,
    quantity: Number,
    status: String
}, {
    timestamps: true
})

export const Orderitem = GLOBAL.model('orderitem', orderItemSchema)