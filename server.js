require("dotenv").config({ quiet: true });
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const { testMySqlConnection } = require("./config/mysql");
const { createEmployeesTable } = require("./models/employeeModel");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", employeeRoutes);

connectDB()
    .then(async () => {
        await testMySqlConnection();
        await createEmployeesTable();
        console.log("MySQL connected and employees table is ready");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database startup failed:", err.message);
        process.exit(1);
    });