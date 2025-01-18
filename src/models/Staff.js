import { GLOBAL } from "../global/index.js"

const StaffSchema = new GLOBAL.Schema({
    fullName: {
        type: String,
        unique: true,
        required: [true, 'Fullname is required']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required']
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: [true, 'Phone number is required']
    },
    emailAddress: {
        type: String,
        unique: true,
        required: [true, 'Email address is required']
    },

    store: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'store'
    },

    password: {
        type: String,
        required: [true, 'Password is required']
    },
  
    createdBy: {
        type: GLOBAL.Schema.Types.ObjectId, ref: 'staff'
    },
    status: {
        type: String,
        default: 'Open',
        enum: ['Open', 'Closed']
    },
    role: {
        type: String,
        default: 'Cashier',
        enum: ['Admin', 'Manager', 'Cashier']
    }
}, {
    timestamps: true
})

export const Staff = GLOBAL.model('staff', StaffSchema)