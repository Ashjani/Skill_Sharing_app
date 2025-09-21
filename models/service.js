const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    status: { 
        type: String,
        enum: ['available', 'in_progress', 'completed'],
        default: 'available'
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);