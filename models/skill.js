// the database schema for skills
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    // This part creates a reference to the User who owns this skill
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

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;
