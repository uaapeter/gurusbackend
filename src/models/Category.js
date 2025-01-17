import { GLOBAL } from "../global/index.js"

const CategorySchema = new GLOBAL.Schema({
    categoryName: {
        type: String,
        unique: true,
        required: [true, 'Category name is required']
    },
    
    createdBy: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'staff'
    },
    products:[{
        type: GLOBAL.Schema.Types.ObjectId, ref: 'product'
    }],
    status: {
        type: String,
        default: 'Open',
        enum: ['Open', 'Closed']
    },
}, {
    timestamps: true
})

export const Category = GLOBAL.model('category', CategorySchema)