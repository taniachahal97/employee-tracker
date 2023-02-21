const connection = require("./db/connection")
const inquirer = require('inquirer');
require('console.table');

process.on('uncaughtException', function (err) {
    console.log(err);
  });


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

            var queryResult = connection.query('SELECT * FROM department', function (err, results) {
                if (err) throw err;
                console.table(queryResult);
              });
        
        }

        else if(result.Options === 'View All Roles'){
            var queryResult = connection.query('SELECT r.id, r.title, r.salary, d.name FROM role r JOIN department d ON r.department_id = d.id', function(err,result){
                console.table(queryResult);
            })
        }

        else if(result.Options === 'View All Employees'){
            var queryResult = connection.query(' SELECT e.id, e.first_name, e.last_name,r.title, r.salary, d.name, m.first_name as manager_name from employee e JOIN employee m  ON e.manager_id = m.id  JOIN role r ON r.id = e.role_id JOIN department d ON r.department_id = d.id', function(err,result){
                console.table(queryResult);
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

        var deptName = result.departmentName;
        var queryResult = connection.query('INSERT INTO department(name) VALUES (?)', deptName, (err, result) => {
            if(err) throw err;
            console.table(queryResult);

        })
    
    })

}

function addRole(){

    const sql = 'SELECT name FROM department';
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

            var deptName = result.department;
            var role = result.roleName;
            var salary = result.salary;

            var deptId = connection.query('SELECT id FROM department WHERE name = ?', deptName, (err, result) => {
                if(err) throw err;
                var queryResult = connection.query('INSERT INTO role(title, salary, department_id) VALUES (?,?,?)',role,salary,deptId, (err,result) => {
                    if(err) throw err;
                    console.table(quertResult);
                })
            });

        })

    })
}

function addEmployee(){

    var managers = [];
    var roles = []; 

    const sql = 'SELECT m.first_name as manager_name from employee e JOIN employee m ON e.manager_id = m.id';
    connection.query(sql, (error, results) => {
        if (error) throw error;

        // create an array of manager names
        managers = results.map((row) => row.manager_name);
    })

    const sql1 = 'SELECT title from role';
    connection.query(sql1, (error,results) => {
        if(error) throw error;

        //create an array of role titles

        roles = results.map((row) => row.title);

    })


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
                choices: roles
            },

            {
                type: 'list',
                name: 'manager',
                message: 'Please select the manager for this employee',
                choices: managers
            },
        ])
        .then(function(result){

            var firstName = result.firstName;
            var lastName = result.lastName;
            var roleName = result.role;
            var managerName = result.manager;

            var roleId = connection.query('SELECT id FROM role WHERE title = ?', roleName, (err, result) => {
                if(err) throw err;
                var managerId = connection.query('SELECT id from employee WHERE first_name = ?', managerName, (err, result) => {
                    if(err) throw err;
                    var queryResult = connection.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',firstName,lastName,roleId,managerId, (err,result) => {
                        if(err) throw err;
                        console.table(quertResult);

                })
                
                })
            });

        })


}



