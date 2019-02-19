var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");
var username;
var password;
var count;
var changes;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password5",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected with ID: " + connection.threadId);
    // code is 3306 :) 
    console.log("\n\n\n ************************************************* \n\n\n" + colors.blue.bold("          Welcome to Bamazon Manager\n\n         Please login to get started :) \n\n     First time here? please just type in your \n   name and managerial access code") + "\n\n\n ************************************************* \n\n\n ");
    count = 0;
    login();
});


login = function () {
    inquirer.prompt([
        {
            name: "username",
            message: "What is your name?",
            type: "input"
        },
        {
            name: "password",
            message: "Please input your managerial access code",
            type: "password"
        }]).then(function (login) {
            username = login.username;
            password = login.password;
            count++;
            user = { name: username };
            checkForCode();
        });
};

checkForCode = function () {
    if (parseInt(password) === 3306) {
        createUser();
    } else if (count < 3) {
        console.log("\n\n\n ************************************************* \n\n\n" + colors.red("WARNING Wrong password, you will only be allowed 2 more tries") + "\n\n\n ************************************************* \n\n\n");
        login();
    } else {
        console.log(colors.red("You have exceeded the number of tries allowed, please try again later. Goodbye!"));
    }
}

createUser = function () {
    connection.query("INSERT INTO managers SET ?", {
        name: username,
        password: true,
        changes: 0
    }, function (err) {
        if (err) throw err;
        console.log("\n\n\n ************************************************* \n\n\n" + colors.cyan("           Welcome ") + colors.underline(username) + colors.cyan("!") + " \n\n\n ************************************************* \n\n\n");
        changes = 0;
        setTimeout(start, 3000);
    })
}

start = function () {
    inquirer.prompt(
        {
            name: "option",
            message: "What would you like to do?",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Leave"]
        }
    ).then(function (answer) {
        switch (answer.option) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLow();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Leave":
                connection.query("UPDATE managers SET ? WHERE ?", [{ changes: changes }, user], function (err, res) {
                    if (err) throw err; console.log(colors.magenta("Thank you, have a nice day!"));
                    connection.end();
                });
                break;
        }
    })
};

viewProducts = function () {
    var table = new Table({
        head: ["ID", "Product Name", "Price", "Quantity in Stock"]
    });
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString() + "\n\n\n");
        setTimeout(start, 3000);
    })
};

viewLow = function () {
    var table = new Table({
        head: ["ID", "Product Name", "Price", "Quantity in Stock"]
    });
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString() + "\n\n\n");
        setTimeout(start, 3000);
    })
};

addInventory = function () {
    inquirer.prompt([
        {
            name: "item",
            message: "Which product would you like to add inventory for?",
            type: "input"
        },
        {
            name: "amount",
            message: "How much would you like to add?",
            type: "input"
        }
    ]).then(function (response) {
        if (isNaN(response.amount) || isNaN(response.item)) {
            console.log("\n\n\n ************************************************* \n\n\n You must input a number for both questions. Please try again.\n\n\n ************************************************* \n\n\n");
            setTimeout(addInventory, 3000);
        } else {
            var newAmount = parseInt(response.amount);
            itemChoice = { item_id: response.item };
            connection.query("SELECT stock_quantity FROM products WHERE ?", itemChoice, function (err, res) {
                if (err) throw err;
                newAmount += res[0].stock_quantity;
                connection.query("UPDATE products SET stock_quantity = ? WHERE ?", [newAmount, itemChoice], function (err, res) {
                    if (err) throw err;
                    console.log("\n\n\n ************************************************* \n\n\n                 " + colors.green("Inventory is updated!") + "\n\n\n ************************************************* \n\n\n")
                    changes++;
                    setTimeout(start, 3000);
                });
            });
        };
    });
};
addProduct = function () {
    inquirer.prompt([
        {
            name: "product",
            message: "What is the name of the product you are adding?",
            type: "input"
        },
        {
            name: "department",
            message: "What is the name of the department it is sold from?",
            type: "input"
        },
        {
            name: "price",
            message: "What is the price of the new product?",
            type: "input"
        },
        {
            name: "quantity",
            message: "How much of this product do we have in stock?",
            type: "input"
        }
    ]).then(function (answers) {
        connection.query("INSERT INTO products SET ?",
            {
                product_name: answers.product,
                department_name: answers.department,
                price: answers.price,
                stock_quantity: answers.quantity
            }, function (err, res) {
                if (err) throw err;
                console.log("\n\n\n ************************************************* \n\n\n                 " + colors.green("New product added!") + "\n\n\n ************************************************* \n\n\n")
                changes++;
                setTimeout(start, 3000);
            });
    });
};
