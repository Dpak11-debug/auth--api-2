const express = require("express");

const employeeController = require("../controllers/employeeController");

const router = express.Router();

router.post("/employees", employeeController.createEmployee);
router.get("/employees", employeeController.getEmployees);

module.exports = router;
