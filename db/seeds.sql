INSERT INTO department (name)
VALUES ("Management"),
       ("Finance"),
       ("Human Resources"),
       ("Consulting");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 50000, 1),
        ("Consultant",40000, 4),
        ("Auditor", 42000, 2),
        ("HR Coordinator", 38000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Jason", "Mathew", 1, 1),
("Andrew", "Simons", 3, 1),
("Kunal", "Patel", 2, 1),
("Lara", "Smith", 1, 4),
("Hao", "Wang", 4, 4);
       
