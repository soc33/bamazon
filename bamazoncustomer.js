var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");
var username;
var password;
var count;
var user;
var total;

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
    console.log("\n\n\n ************************************************* \n\n\n" + colors.blue.bold("               Welcome to Bamazon \n\n         Please login to get started :) \n\n     First time here? please just type in the \n   username and password you would like and an \n        account will be created for you! \n\n                Happy Shopping!") + "\n\n\n ************************************************* \n\n\n ");
    count = 0;
    login();
});


login = function () {
    inquirer.prompt([
        {
            name: "username",
            message: "What is your username?",
            type: "input"
        },
        {
            name: "password",
            message: "Please input your password",
            type: "password"
        }]).then(function (login) {
            username = login.username;
            password = login.password;
            count++;
            user = { login_name: username };
            checkForUser();
        });
};
checkForUser = function () {
    connection.query("SELECT * FROM users WHERE ?", user, function (err, res) {
        if (err || res[0] === undefined) {
            console.log(err);
            createUser();
        } else {
            if (res[0].login_password === password) {
                console.log(colors.magenta(" \n\n *****Successful login :) ***** \n\n"));
                total = res[0].money_spent;
                start();
            } else {
                if (count < 3) {
                    console.log("\n\n\n ************************************************* \n\n\n" + colors.red("     ***ERROR***") + " Invalid username and password \n\n\n       Please reenter your login information \n\n\n ************************************************* \n\n\n");
                    login();
                } else {
                    console.log(colors.red("You have exceeded the number of tries allowed, please try again later. Goodbye!"));
                    connection.end();
                }
            }
        }
    });
};

createUser = function () {
    connection.query("INSERT INTO users SET ?",
        {
            login_name: username,
            login_password: password,
            money_spent: 0
        }, function (err, res) {
            if (err) throw err;
            console.log("\n\n\n ************************************************* \n\n\n" + colors.cyan("           Welcome ") + colors.underline(username) + colors.cyan("!") + " \n\n\n ************************************************* \n\n\n");
            total = 0;
            setTimeout(start, 3000);
        }
    );
};


start = function () {
    var table = new Table({
        head: ["ID", "Product Name", "Price", "Quantity in Stock"]
    });
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString() + "\n\n\n");
        inquirer.prompt({
            name: "order",
            message: "What would you like to do?",
            type: "list",
            choices: ["Buy something", "Check my spending", "Leave"]
        }).then(function (choice) {
            switch (choice.order) {
                case "Buy something":
                    buyThings();
                    break;
                case "Check my spending":
                    checkTotal();
                    break;
                case "Leave":
                    console.log("\n\n\n " + colors.yellow("Thank you for shopping with us! Come back soon!"));
                    connection.end();
                    break;
            }
        });
    });
};

var choice;
var amount;
var quantity;
var price;

buyThings = function () {
    inquirer.prompt([{
        name: "choice",
        message: "Input the number of the item you would like to buy",
        type: "input"
    },
    {
        name: "amount",
        message: "How many of this item would you like to buy?",
        type: "input"
    }]).then(function (answer) {
        choice = parseInt(answer.choice);
        amount = parseInt(answer.amount);
        if (isNaN(choice) || isNaN(amount)) {
            console.log("You must input a number for each question. Please try again.");
            buyThings();
        } else {
            connection.query("SELECT stock_quantity, price FROM products WHERE item_id = " + choice, function (err, res) {
                if (err) throw err;
                quantity = res[0].stock_quantity;
                price = res[0].price;
                if (quantity < amount) {
                    console.log("Insufficient Quantity in stock! Please try again");
                    buyThings();
                } else {
                    console.log("\n\n\n ************************************************* \n\n\n" + colors.rainbow("       Congratulations") + " on your new purchase! \n\n\n ************************************************* \n\n\n");
                    var newAmount = quantity - amount;
                    var cost = amount * price;
                    total += cost;
                    connection.query("UPDATE products SET stock_quantity = " + newAmount + " WHERE item_id = " + choice, function (err, res) {
                        if (err) throw err;
                        console.log(colors.green("           Your total cost was $") + cost + "\n\n\n ************************************************* \n\n\n");
                        console.log("Updating inventory...");
                        updateTotal();
                        setTimeout(start, 3000);
                    })
                }
            })

        }
    })
};

updateTotal = function () {
    connection.query("UPDATE users SET money_spent = ? WHERE ?", [total, user], function (err, res) {
        if (err) throw err;
    })
}

checkTotal = function () {
    connection.query("SELECT money_spent FROM users WHERE ?", user, function (err, res) {
        if (err) throw err;
        console.log("\n\n\n ************************************************* \n\n\n        You've spent " + res[0].money_spent + " dollars \n\n\n ************************************************* \n\n\n ");
        setTimeout(start, 3000);
    })
}