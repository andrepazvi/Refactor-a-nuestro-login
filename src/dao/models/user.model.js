import mongoose from "mongoose";

const collection = 'users';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    full_Name: {
        type: String,
        default: ''
    },
    age: Number,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        required: true,
        enum: ["user", "admin", "premium"],
        default: 'user'
    },
    carts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    }],
    avatar: {
        type: String,
        default: ""
    }
});

userSchema.pre('find', function () {
    this.populate('carts');
});

export const userModel = mongoose.model(collection, userSchema);
