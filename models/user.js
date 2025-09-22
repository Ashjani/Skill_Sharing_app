// the database schema for user accounts
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        default: 1
    },
    role: {
        type: String,
        enum: ['Member', 'Admin'], // Restrict roles to these values
        default: 'Member'         // New users are 'Member' by default
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
