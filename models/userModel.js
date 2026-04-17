const db = require("../config/db");

// create user
const createUser = async (name, email, password, city) => {
    await db.execute(
        "INSERT INTO users (name, email, password, city) VALUES (?, ?, ?, ?)",
        [name, email, password, city]
    );
};

// find by email
const findByEmail = async (email) => {
    const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0];
};

// get all users
const getAllUsers = async () => {
    const [rows] = await db.execute("SELECT * FROM users");
    return rows;
};

// get users by city
const getUsersByCity = async (city) => {
    const [rows] = await db.execute(
        "SELECT id, name, email, city FROM users WHERE city = ?",
        [city]
    );
    return rows;
};

module.exports = {
    createUser,
    findByEmail,
    getAllUsers,
    getUsersByCity
};