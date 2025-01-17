import { GLOBAL } from "../global/index.js"

const SupplierSchema = new GLOBAL.Schema({
    supplierName: {
        type: String,
        unique: true,
        required: [true, 'Supplier name is required']
    },
    companyName: {
        type: String,
        unique: true,
        required: [true, 'Company is required']
    },
    supplierEmail: {
        type: String,
        unique: true,
    },
    supplierPhone: {
        type: String,
        unique: true,
        required: [true, 'Supplier phone is required']
    },

    supplierAddress: {
        type: String,
    },
    createdBy: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'staff'
    },
    status: {
        type: String,
        default: 'Open',
        enum: ['Open', 'Closed']
    },
}, {
    timestamps: true
})

export const Supplier = GLOBAL.model('supplier', SupplierSchema)