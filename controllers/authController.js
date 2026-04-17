const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const ACCESS_SECRET = "access_secret_123";
const REFRESH_SECRET = "refresh_secret_123";

let refreshTokens = [];


exports.signup = async (req, res) => {
    try {
        const { name, email, password, city } = req.body;

        if (!name || !email || !password || !city) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await userModel.findByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.createUser(name, email, hashedPassword, city);

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Signup failed",
            error: err.message
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });
        }

        const [rows] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            ACCESS_SECRET,
            { expiresIn: "2m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id, email: user.email },
            REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        refreshTokens.push(refreshToken);

        return res.json({
            success: true,
            message: "Login successful",
            data: {
                accessToken,
                refreshToken
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: err.message
        });
    }
};



exports.refreshToken = (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Refresh token required"
            });
        }

        if (!refreshTokens.includes(token)) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        jwt.verify(token, REFRESH_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Token expired or invalid"
                });
            }

            const newAccessToken = jwt.sign(
                { id: user.id, email: user.email },
                ACCESS_SECRET,
                { expiresIn: "2m" }
            );

            return res.json({
                success: true,
                message: "New access token generated",
                data: {
                    accessToken: newAccessToken
                }
            });
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Refresh token error",
            error: err.message
        });
    }
};


exports.getUsersByCity = async (req, res) => {
    try {
        const city = req.params.city || req.query.city;

        if (!city) {
            return res.status(400).json({
                success: false,
                message: "City is required"
            });
        }

        const users = await userModel.getUsersByCity(city);

        return res.status(200).json({
            success: true,
            message: users.length ? "Users fetched successfully" : "No users found for this city",
            data: users
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users by city",
            error: err.message
        });
    }
};