import { GLOBAL } from "../global/index.js"

const StoreSchema = new GLOBAL.Schema({
    storeName: {
        type: String,
        unique: true,
        required: [true, 'Store name is required']
    },
    storePhone: {
        type: String,
        unique: true,
        required: [true, 'Store phone is required']
    },
    location: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'location',
        required: [true, 'Location is required']
    },
    staff: [{
        type: GLOBAL.Schema.Types.ObjectId, ref: 'staff'
    }],
    manager: {
        default: null,
        type: GLOBAL.Schema.Types.ObjectId, ref: 'staff'
    },
    createdBy: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'staff'
    },
    products:[{
        type: GLOBAL.Schema.Types.ObjectId, ref: 'product'
    }],
    storeAddress: String,
    storeEmail: String,

    status: {
        type: String,
        default: 'Open',
        enum: ['Open', 'Closed']
    },
}, {
    timestamps: true
})

export const Store = GLOBAL.model('store', StoreSchema)