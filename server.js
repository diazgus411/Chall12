const inquirer = require('inquirer');
const mysql = require('mysql2');

//Creates a connection to the SQL database
const db = mysql.createConnection(
    {
      host: 'LocalHost',
      user: 'root',
      password: 'Chicken',
      database: 'employee_db'
    },
  console.log("Connecting to the employee_db!")
);
//Async function to handle the departments
async function showDepartments() {
    db.query("SELECT * FROM departments", function (err, results) {
      if (err) {
        console.log(err);
      } 
        console.log("List of the Departments:");
        console.table(results);
        handleOptions();
    });
}
//Async function to display the roles of employees
async function displayRoles() {
    db.query("SELECT * FROM roles", function (err, results) {
        if (err) {
          console.log(err);
        } 
        console.log("List of Roles:");
        console.table(results);
        handleOptions();
    });
}
// Async function to display the employees
async function displayEmployees() {
    const sql = `
    SELECT employees.id AS "Employee ID",
    employees.first_name AS "First Name",
    employees.last_name AS "Last Name",
    roles.title AS "Title",
    departments.department_name AS "Department",
    roles.salary AS "Salary",
    CONCAT (manager.first_name, " ", manager.last_name, "") AS "Manager"
    FROM employees
    LEFT JOIN roles ON (employees.role_id = roles.id)
    LEFT JOIN departments ON (roles.department_id = departments.id)
    LEFT JOIN employees manager ON employees.manager_id = manager.id;
    `;

    db.query(sql, function (err, results) {
        if (err) {
          console.log(err);
        }
        console.log("List of Employees:");
        console.table(results);
        handleOptions();
    });
}
//Async function to create new departments
async function addDepartment() {
    const addDepartmentQuestions = await inquirer.prompt ([
        {
            type: "input",
            name: "addDepartment",
            message: "What is the name of the Department you want to add?"
        }
    ]);
    const sql = "INSERT INTO departments (department_name) VALUES (?)";
//Create variable for the paramaters to be added to SQL statement 
    const params = addDepartmentQuestions.addDepartment;

    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log(`Department ${addDepartmentQuestions.addDepartment} has been added to the database.`);
        console.table(results);
        showDepartments();
    }); 
}
//Async functio to create new roles
async function addRole() {
    const [deptList] = await db.promise().query("SELECT * FROM departments");
    let showDept = deptList.map(({ id, department_name }) => ({
        name: department_name,
        value: id,
        })
    );
    // create variable for the inquirer questions and include the choices for the dept list
    const addRoleQuestion = await inquirer.prompt ([
        {
            type: "input",
            name: "title",
            message: "What is the title of the new role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of this postion?"
        },
        {
            type: "list",
            name: "department_id",
            message: "What is the department this role belongs to?",
            choices: showDept
        }
    ]);
    // variable for sql for the insert prepared statement for the roles table
    const sql = "INSERT INTO roles SET ?";
    
    db.query(sql, addRoleQuestion, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log(`${addRoleQuestion.title} has been added to the database!`)
        console.table(results);
        displayRoles();
    });
}
// function for adding new employees
async function addEmployee() {
    // create in [] a variable that awaits a promise query to list all of the roles from the roles table
    const [rolesList] = await db.promise().query("SELECT * FROM roles");
    // create another variable to loop using map through the roles list and destruct the objects {} 
    let showRoles = rolesList.map(({ id, title }) =>
        ({
            name: title,
            value: id,
        })
    );
    const [employeeList] = await db.promise().query("SELECT * FROM employees");
    let showEmp = employeeList.map(({ id, first_name, last_name, }) =>
        ({
            name: first_name + " " + last_name,
            value: id,
        })
    );
    const addEmployeeQuestion = await inquirer.prompt ([
        {
            type: "input",
            name: "first_name",
            message: "What is the first name of the new Employee?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the last name of the new Employee?"
        },
        {
            type: "list",
            name: "role_id",
            message: "What is the role of the new Employee?",
            choices: showRoles
        },
        {
            type: "list",
            name: "manager_id",
            message: "Who is the manager of this new Employee?",
            choices: showEmp
        }
    ]);
    const sql = "INSERT INTO employees SET ?";

    db.query(sql, addEmployeeQuestion, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log(`${addEmployeeQuestion.first_name} ${addEmployeeQuestion.last_name} has been added to the database!`);
        console.table(results);
        displayEmployees();
    });

}
//Async function to update employee roles
async function updateEmployee() {
    const [employeeList] = await db.promise().query("SELECT * FROM employees");
    let showEmp = employeeList.map(({ id, first_name, last_name, }) =>
        ({
            name: first_name + " " + last_name,
            value: id,
        })
    );
    const [rolesList] = await db.promise().query("SELECT * FROM roles");
    let showRoles = rolesList.map(({ id, title }) =>
        ({
            name: title,
            value: id,
        })
    );
    const updateEmpQuestions = await inquirer.prompt ([
        {
            type: "list",
            name: "id",
            message: "Which employee do you want to update?",
            choices: showEmp
        },
        {
            type: "list",
            name: "role_id",
            message: "Which role do you the employee updated to?",
            choices: showRoles
        }
    ]);
    const sql = "UPDATE employees SET role_id = ? WHERE id = ?";
    const params = [updateEmpQuestions.role_id, updateEmpQuestions.id]

    console.log()
    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log(`Employee #${updateEmpQuestions.id}'s role has been updated to role ${updateEmpQuestions.role_id}`);
        console.table(results);
        displayEmployees();
    });
}
//Async function to show options
async function handleOptions() {
    const options = [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee's Role", 
    ]

    const results = await inquirer.prompt([
        {
            type: "list",
            name: "command",
            message: "what would you like to do?",
            choices: options,
        },
    ]);

    if (results.command == "View All Departments") {
        showDepartments();
    } else if (results.command == "View All Roles") {
        displayRoles();
    } else if (results.command == "View All Employees") {
        displayEmployees();
    } else if (results.command == "Add a Department") {
        addDepartment();
    } else if (results.command == "Add a Role") {
        addRole();
    } else if (results.command == "Add an Employee") {
        addEmployee();
    } else if (results.command == "Update an Employee's Role") {
        updateEmployee();
    }
}

handleOptions();