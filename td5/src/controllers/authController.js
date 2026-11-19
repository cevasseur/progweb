import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Sign in
export async function registerUser(body) {
    try {
        const { email, password } = body;

        if (!email || !password) {
            return { success: false, message: "L'email et le mot de passe sont obligatoires" };
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            email,
            password: hashedPassword
        });

        return {
            success: true,
            data: {
                id: newUser._id,
                email: newUser.email
            },
            message: "Utilisateur enregistré avec succès"
        };
    } catch (err) {
        if (err.code === 11000) {
            return { success: false, message: "Cet email est déjà utilisé" };
        }
        return { success: false, message: "Erreur lors de l'inscription : " + err.message };
    }
}

// Log in
export async function loginUser(body) {
    try {
        const { email, password } = body;

        if (!email || !password) {
            return { success: false, message: "L'email et le mot de passe sont obligatoires" };
        }

        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, message: "Identifiants invalides" };
        }

        const isPasswordValid = bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { success: false, message: "Identifiants invalides" };
        }

        const secret = process.env.JWT_SECRET || 'mon_secret_jwt_par_defaut';
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            secret,
            { expiresIn: '1h' }
        );

        return {
            success: true,
            token: token,
            message: "Connexion réussie"
        };
    } catch (err) {
        return { success: false, message: "Erreur lors de la connexion : " + err.message };
    }
}