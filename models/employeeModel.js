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

module.exports = {
  createEmployeesTable,
  createEmployee,
  getAllEmployees
};
