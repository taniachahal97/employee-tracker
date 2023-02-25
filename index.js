const connection = require("./db/connection")
const inquirer = require('inquirer');
require('console.table');

process.on('uncaughtException', function (err) {
    console.log(err);
  });


var role;
var salary;
var firstName;
var lastName;
  
  // TODO: Create a function to initialize app and prompt questions to the user
init();

function init() {

    inquirer.prompt([
        {
            type: 'list',
            name: 'Options',
            message: 'Please select one out of the following options',
            choices: ["View All Departments","View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Quit"]
        },
    ])
    .then(function(result){
    
        if(result.Options === 'View All Departments'){

            connection.query('SELECT * FROM department', function (err, results) {
                if (err) throw err;
                console.table(results);
                init();
              });
        
        }

        else if(result.Options === 'View All Roles'){
            connection.query('SELECT r.id, r.title, r.salary, d.name FROM role r JOIN department d ON r.department_id = d.id', function(err,results){
                console.table(results);
                init();
            })
        }

        else if(result.Options === 'View All Employees'){
            connection.query(' SELECT e.id, e.first_name, e.last_name,r.title, r.salary, d.name, m.first_name as manager_name from employee e JOIN employee m  ON e.manager_id = m.id  JOIN role r ON r.id = e.role_id JOIN department d ON r.department_id = d.id', function(err,results){
                console.table(results);
                init();
            })
        }

        else if(result.Options === 'Add a Department'){
            
            addDepartment();
        }

        else if(result.Options === 'Add a Role'){
            addRole();
        }

        else if(result.Options === 'Add an Employee'){
            addEmployee();
        }

        else if(result.Options === 'Update an Employee Role'){
            updateEmployee();
        }

        else if(result.Options === 'Quit'){
            console.log('Bye Bye!!');
        }

    });

        
}

function addDepartment(){

    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Please Enter the Department Name that you want to Add',
        },
    ])
    .then(function(result){

        var deptName = result.departmentName
        connection.query('INSERT INTO department(name) VALUES (?)', deptName, function(err, result) {
            if(err) throw err;
            displayDept();
            
            })
    
    })

}

function displayDept(){
    
    connection.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        console.table(results);
        init();
    });

}



function addRole(){

    const sql = `SELECT name FROM department`;
    connection.query(sql, (error, results) => {
        if (error) throw error;

        // create an array of department names
        const departments = results.map((row) => row.name);

        inquirer.prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'Please Enter the Role Name that you want to Add',
            },

            {
                type: 'input',
                name: 'salary',
                message: 'Please Enter the salary for this role',
            },

            {
                type: 'list',
                name: 'department',
                message: 'Please select the Department for this role from the following options',
                choices: departments
            },
        ])
        .then(function(result){

            var deptName = result.department
            role = result.roleName
            salary = result.salary

            connection.query(`SELECT id FROM department WHERE name = ?`, deptName, function(err, result) {
                if(err) throw err;
                createRole(role,salary,result[0].id);
                
                })
        });

    })

}


function createRole(role,salary,deptId){

    console.log('Inside this function')
    console.log(salary);
    console.log(role);
    //console.log(deptId);
    connection.query(`INSERT INTO role(title, salary, department_id) VALUES (?,?,?)`,[role,salary,deptId], function (err,results){
        if(err) throw err;
        displayRole();

    });
}

function displayRole(){
    connection.query('SELECT * FROM role', function (err, results) {
        if (err) throw err;
        console.table(results);
        init();
      });''

}

function addEmployee(){

    

    const sql = 'SELECT m.first_name as manager_name from employee e JOIN employee m ON e.manager_id = m.id';
    connection.query(sql, (error, results) => {
        if (error) throw error;

        // create an array of manager names
        const managers = results.map((row) => row.manager_name);
        //console.log(managers);


        const sql1 = 'SELECT title from role';
        connection.query(sql1, (error,results) => {
            if(error) throw error;

                //create an array of role titles

                const roles = results.map((row) => row.title);
                //console.log(roles);

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'Please Enter the Employee first name',
                    },
        
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'Please Enter the Employee last name',
                    },
        
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Please select the role for this employee',
                        choices: roles,
                    },
        
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Please select the manager for this employee',
                        choices: managers
                    },
                ])
                .then(function(result){
        
                    firstName = result.firstName;
                    lastName = result.lastName;
                    var roleName = result.role;
                    var managerName = result.manager;
        
                    connection.query('SELECT id FROM role WHERE title = ?', roleName, function (err, result){
                        if(err) throw err;
                        getManager(result[0].id, managerName)
                        
        
                    })
                        
                })
            });
        
        });
}

function getManager(roleId, managerName){

    var id = roleId;
    var manager = managerName 
    console.log(id);
    console.log(manager);
    connection.query('SELECT id from employee WHERE first_name = ?', manager, (err, result) => {
        if(err) throw err;
        createEmployee(id, result[0].id);

    });

        

}

function createEmployee(roleId, managerId){

    var role_id = roleId;
    var manager_id = managerId;

    console.log(role_id);
    console.log(manager_id);

    connection.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',[firstName,lastName,role_id,manager_id], (err,result) => {
        if(err) throw err;
        displayEmployees();
    });

}

function displayEmployees(){

    connection.query(' SELECT e.id, e.first_name, e.last_name,r.title, r.salary, d.name, m.first_name as manager_name from employee e JOIN employee m  ON e.manager_id = m.id  JOIN role r ON r.id = e.role_id JOIN department d ON r.department_id = d.id', function(err,results){
        if(err) throw err;
        console.table(results);
        init();

    })
};


function updateEmployee(){

    const sql = `SELECT first_name FROM employee`;
    connection.query(sql, (error, results) => {
        if (error) throw error;

        const employeeNames = results.map((row) => row.first_name);

        const sql1 = 'SELECT title from role';
        connection.query(sql1, (error,results) => {
            if(error) throw error;

            //create an array of role titles

            const roles = results.map((row) => row.title);

            const sql2 = 'SELECT last_name FROM employee';
            connection.query(sql2, (error,results) => {
                if(error) throw error;

                const empLastNames = results.map((row) => row.last_name);


                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'empName',
                        message: 'Please select the first employee to update',
                        choices: employeeNames,
                    },

                    {
                        type: 'list',
                        name: 'empLastName',
                        message: 'Please select last name of employee to update',
                        choices: empLastNames,
                    },
        
                    {
                        type: 'list',
                        name: 'title',
                        message: 'Please select the new role for this employee',
                        choices: roles,
                    },

                ]).then(function(result){

                    var roleTitle = result.title;
                    var first_name = result.empName;
                    var last_name = result.empLastName;

                    console.log(roleTitle);
                    console.log(first_name);

                    connection.query('SELECT id FROM role WHERE title = ?', roleTitle, function (err, result){
                        if(err) throw err;
                        updateRole(result[0].id, first_name, last_name);

                    });
                });

            });
        });

    })

}

function updateRole(roleId, first_name, last_name){

    var role_id = roleId;
    var emp_name = first_name;
    var emp_last_name = last_name;

    console.log(role_id);
    console.log(emp_name);

    connection.query(`UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`, [role_id, emp_name, emp_last_name], function(err, result){
        if(err) throw err;
        displayEmployees();
        init();

    });
}