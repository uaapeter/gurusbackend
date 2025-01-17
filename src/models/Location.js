import { GLOBAL } from "../global/index.js"

const locationSchema = new GLOBAL.Schema({
    locationName: {
        type: String,
        unique: true,
        required: [true, 'Location name is required']
    },
    staff: [{
        type: GLOBAL.Schema.Types.ObjectId, ref: 'staff'
    }],
    createdBy: {
        default: null,
        type: GLOBAL.Schema.Types.ObjectId, ref: 'employee'
    },
}, {
    timestamps: true
})

export const Location =GLOBAL.model('location', locationSchema)