const connection = require('../config/connection');

function CardPayment() {

    //get all details of all bank cards used for orders.
    this.getAll = (res) => {
        let output = {},
            query = 'SELECT * FROM card_payment ' +
            'LEFT JOIN customer_order ON card_payment.order_id = customer_order.customer_order_id';

        connection.acquire((err, con) => {
            if (err) {
                res.json({
                    status: 100,
                    message: "Error in connection database"
                });
                return;
            }

            con.query(query, (err, result) => {
                con.release();
                if (err) {
                    res.json(err);
                } else {
                    if (result.length > 0) {
                        output = {
                            status: 1,
                            card_payments: result
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No card payments found'
                        };
                    }
                    res.json(output);
                }
            });
        });
    };

    //get all details of all bank cards used for a certain order.
    this.getOnePerOrder = (orderId, res) => {
        let output = {}, query = 'SELECT * FROM card_payment ' + 
            'LEFT JOIN account_type ON card_payment.account_type_id = account_type.account_type_id WHERE order_id = ?';

        connection.acquire((err, con) => {
            if (err) {
                res.json({
                    status: 100,
                    message: "Error in connection database"
                });
                return;
            }

            con.query(query, [orderId], (err, result) => {
                con.release();
                if (err) {
                    res.json(err);
                } else {
                    if (result.length > 0) {
                        output = {
                            status: 1,
                            card_payments: result
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No card payments for the given order was found.'
                        };
                    }
                    res.json(output);
                }
            });
        });
    };

}

module.exports = new CardPayment();