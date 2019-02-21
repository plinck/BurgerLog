use burger_db;

UPDATE burgers
SET name = "New Burger in SQL",
isDevoured = false
WHERE id = 6;