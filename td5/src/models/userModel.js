import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: { 
        type: String, 
        unique: true, 
        lowercase: true
    },
    password: { type: String }
}, {
    timestamps: true // Génère automatiquement createdAt et updatedAt
});

export default model('User', userSchema);