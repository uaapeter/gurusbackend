import { GLOBAL } from "../global/index.js";

const transactionSchema = new GLOBAL.Schema({
    orderId: {
        type: String,
        set: e => e.toString()
    },
    
    cashier: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'staff'
    },
    amount: Number,
   
    paymentMethod: {
        type: String,
        default: 'Pending',
        enum: ['Cash', 'POS', 'Transfer', 'Pending']
    },

    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const Transaction = GLOBAL.model('transaction', transactionSchema)

