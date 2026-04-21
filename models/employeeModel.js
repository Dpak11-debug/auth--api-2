const { pool } = require("../config/mysql");

const createEmployeesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      department VARCHAR(100) NOT NULL,
      salary DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await pool.query(query);
};

const createEmployee = async (data) => {
  if (Array.isArray(data)) {
    const values = data.map((emp) => [
      emp.name,
      emp.email,
      emp.department,
      emp.salary
    ]);

    const query = `
      INSERT INTO employees (name, email, department, salary)
      VALUES ?
    `;

    const [result] = await pool.query(query, [values]);

    const [rows] = await pool.query(
      `SELECT * FROM employees WHERE id >= ? AND id <= ?`,
      [result.insertId, result.insertId + result.affectedRows - 1]
    );

    return rows;
  }


  const { name, email, department, salary } = data;

  const query = `
    INSERT INTO employees (name, email, department, salary)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    name,
    email,
    department,
    salary
  ]);

  const [rows] = await pool.query(
    "SELECT * FROM employees WHERE id = ?",
    [result.insertId]
  );

  return rows[0];
};

const getAllEmployees = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM employees ORDER BY created_at DESC"
  );
  return rows;
};

const updateEmployeeById = async (id, updates) => {
  const fields = [];
  const values = [];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }
  if (updates.email !== undefined) {
    fields.push("email = ?");
    values.push(updates.email);
  }
  if (updates.department !== undefined) {
    fields.push("department = ?");
    values.push(updates.department);
  }
  if (updates.salary !== undefined) {
    fields.push("salary = ?");
    values.push(updates.salary);
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);

  await pool.query(
    `UPDATE employees SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  const [rows] = await pool.query("SELECT * FROM employees WHERE id = ?", [id]);
  return rows[0] || null;
};

const deleteEmployeeById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM employees WHERE id = ?", [id]);

  if (!rows.length) {
    return null;
  }

  await pool.query("DELETE FROM employees WHERE id = ?", [id]);
  return rows[0];
};

module.exports = {
  createEmployeesTable,
  createEmployee,
  getAllEmployees,
  updateEmployeeById,
  deleteEmployeeById
};
