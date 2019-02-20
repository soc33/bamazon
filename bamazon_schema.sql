drop database if exists bamazon_db;
create database bamazon_db;

use bamazon_db;

CREATE TABLE managers (
	name VARCHAR(30) NOT NULL,
    password bool NOT NULL,
    changes INT(10) NOT NULL
    );
    
create table products (
	item_id integer not null auto_increment,
    product_name varchar(50) not null,
    department_name varchar(50) not null,
    price integer(100) not null,
    stock_quantity integer(100),
    primary key (item_id)
    );

CREATE TABLE users (
	login_name VARCHAR(30) NOT NULL,
    login_password VARCHAR(30) NOT NULL,
    money_spent INT(30) NOT NULL
    );
    

insert into products (product_name, department_name, price, stock_quantity) values ("Astronaught Ice Cream", "Food", 4.89, 150);
insert into products (product_name, department_name, price, stock_quantity) values ("Goosebumps Volume 1", "Books", 8.99, 43);
insert into products (product_name, department_name, price, stock_quantity) values ("Scrunchies (2 pack)", "90's Accessories", 1.50, 222);
insert into products (product_name, department_name, price, stock_quantity) values ("World of Warcraft", "Computer Games", 59.99, 50);
insert into products (product_name, department_name, price, stock_quantity) values ("Twix bar", "Food", 1.09, 549);
insert into products (product_name, department_name, price, stock_quantity) values ("Programmer's mug", "Collectibles", 12, 13);
insert into products (product_name, department_name, price, stock_quantity) values ("King of Tokyo", "Board Games", 35, 14);
insert into products (product_name, department_name, price, stock_quantity) values ("Harry Potter and the Socerer's Stone", "Books", 7.89, 43);
insert into products (product_name, department_name, price, stock_quantity) values ("Sweat Wristbands", "90's Accessories", 3.50, 350);
insert into products (product_name, department_name, price, stock_quantity) values ("Overwatch", "Computer Games", 49.98, 1000);
insert into products (product_name, department_name, price, stock_quantity) values ("Betrayal at House on the Hill", "Board Games", 42, 56);
insert into products (product_name, department_name, price, stock_quantity) values ("Programmer's T-shirt", "Collectibles", 13.25, 89);

select * from products;