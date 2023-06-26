INSERT INTO departments (department_name)
VALUES  ("Management"),
        ("Chef"),
        ("Design/Marketing"),
        ("Security"),
        ("Waiter");


INSERT INTO roles (title, salary, department_id)
VALUES ("Store Manager", 300000, 1),
       ("Assistant Manager", 150000, 1),
       ("Head Chef", 220000, 2),
       ("Secondary Chef(s)", 110000, 2),
       ("Lead Designer", 175000, 3),
       ("Designer Team Member", 90000, 3),
       ("Security Team Lead", 200000, 4),
       ("Security Team Member", 80000, 4),
       ("Waiter Team Lead", 155000, 5),
       ("Waiter/Waitress", 80000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Gustavo", "Diaz", 1, 1),
       ("Belinda", "Davodoff", 2, 1),
       ("Jim", "Handler", 3, 1),
       ("Sym", "Hardway", 4, 2),
       ("Carol", "Sim", 4, 2),
       ("Athena", "Melo", 5, 1),
       ("Carrie", "Steves", 6, 2),
       ("Zach", "Barr", 6, 2),
       ("Tony", "Rodgers", 7, 1),
       ("Peter", "Quill", 8, 1),
       ("Seven", "Eel", 9, 1),
       ("Sall", "Mande", 10, 1);