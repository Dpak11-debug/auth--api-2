const employeeModel = require("../models/employeeModel");

exports.createEmployee = async (req, res) => {
  try {
    const data = req.body;
    const employees = Array.isArray(data) ? data : [data];

    if (employees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body cannot be empty"
      });
    }

    const formattedEmployees = [];

    for (const emp of employees) {
      const { name, email, department, salary } = emp;

      if (!name || !email || !department || salary === undefined) {
        return res.status(400).json({
          success: false,
          message: "name, email, department and salary are required"
        });
      }

      const numericSalary = Number(salary);

      if (Number.isNaN(numericSalary) || numericSalary < 0) {
        return res.status(400).json({
          success: false,
          message: "salary must be a valid non-negative number"
        });
      }

      formattedEmployees.push({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        department: String(department).trim(),
        salary: numericSalary
      });
    }
    const result = await employeeModel.createEmployee(
      formattedEmployees.length === 1 ? formattedEmployees[0] : formattedEmployees
    );

    return res.status(201).json({
      success: true,
      message:
        formattedEmployees.length === 1
          ? "Employee created successfully"
          : "Employees created successfully",
      data: result
    });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Duplicate email found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create employee(s)",
      error: err.message
    });
  }
};

exports.getEmployees = async (_req, res) => {
  try {
    const employees = await employeeModel.getAllEmployees();

    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: employees
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: err.message
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid employee id is required"
      });
    }

    const { name, email, department, salary } = req.body;
    const updates = {};

    if (name !== undefined) {
      updates.name = String(name).trim();
    }
    if (email !== undefined) {
      updates.email = String(email).trim().toLowerCase();
    }
    if (department !== undefined) {
      updates.department = String(department).trim();
    }
    if (salary !== undefined) {
      const numericSalary = Number(salary);
      if (Number.isNaN(numericSalary) || numericSalary < 0) {
        return res.status(400).json({
          success: false,
          message: "salary must be a valid non-negative number"
        });
      }
      updates.salary = numericSalary;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update"
      });
    }

    const updatedEmployee = await employeeModel.updateEmployeeById(id, updates);

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Duplicate email found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: err.message
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid employee id is required"
      });
    }

    const deletedEmployee = await employeeModel.deleteEmployeeById(id);

    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      data: deletedEmployee
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete employee",
      error: err.message
    });
  }
};
