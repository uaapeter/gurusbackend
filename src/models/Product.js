import { GLOBAL } from "../global/index.js"

const productSchema = new GLOBAL.Schema({
    productBatch: {
        type: String,
        unique: true,
        required: [true, 'Product batch is required']
    },
    barcode: {
        type: String,
        unique: true,
        required: [true, 'Barcode is required']
    },
    productName: {
        type: String,
        unique: true,
        required: [true, 'Product name is required']
    },
    productDescription: {
        type: String,
    },
    costPrice: {
        type: Number,
        required: [true, 'Caost price is required']
    },
    sellingPrice: {
        type: Number,
        required: [true, 'Selling price is required']
    },

    cartonQty: {
        type: Number,
    },
    supplier: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'supplier'
    },
    category: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'category'
    },
    store: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'store'
    },
    mftDate: Date,
    expireDate:Date,
    createdBy: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'staff'
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive']
    },
}, {
    timestamps: true
})


productSchema.methods.updateQty = async function(id, type, qty) {
    const product = await this.model('product').findById(id);
    const quantity = product.cartonQty

    const newQty = type == 'SALE' ? parseInt(quantity) - parseInt(qty) : parseInt(quantity) + parseInt(qty);

    return this.model('product').findByIdAndUpdate(id, {$set: {cartonQty: newQty}})
}

export const Product = GLOBAL.model('product', productSchema)