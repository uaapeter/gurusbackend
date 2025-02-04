import { GLOBAL } from "../global/index.js"

const chargeSchema = new GLOBAL.Schema({
    chargeName: {
        type: String,
        unique: true,
        required: [true, 'Charge name is required']
    },
    chargeValue: {
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

export const Charge = GLOBAL.model('charge', chargeSchema)