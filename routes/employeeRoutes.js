const express = require("express");

const employeeController = require("../controllers/employeeController");

const router = express.Router();

router.post("/employees", employeeController.createEmployee);
router.get("/employees", employeeController.getEmployees);
router.put("/employees/:id", employeeController.updateEmployee);
router.delete("/employees/:id", employeeController.deleteEmployee);

module.exports = router;
