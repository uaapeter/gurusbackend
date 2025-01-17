import { GLOBAL } from "../global/index.js"

const DiscountSchema = new GLOBAL.Schema({
    discountName: {
        type: String,
        unique: true,
        required: [true, 'Discount name is required']
    },
    discountValue: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'staff'
    },
    
    status: {
        type: Boolean,
        default: true,
        enum: [false, true]
    },
}, {
    timestamps: true
})

export const Discount = GLOBAL.model('discount', DiscountSchema)