var connection = require('../config/connection');

function CustomerOrderStatus() {
    //get all customer order statuses.
    this.getAll = function (res) {
        var output = {},
            query = 'SELECT * FROM customer_order_status';

        connection.acquire(function (err, con) {
            if (err) {
                res.json({
                    status: 100,
                    message: "Error in connection database"
                });
                return;
            }

            con.query(query, function (err, result) {
                con.release();
                if (err) {
                    res.json(err);
                } else {
                    if (result.length > 0) {
                        output = {
                            status: 1,
                            customer_order_statuses: result
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No order statuses found'
                        };
                    }
                    res.json(output);
                }
            });
        });
    };

    //get a single customer order status.
    this.getOne = function (id, res) {
        var output = {},
            query = 'SELECT * FROM customer_order_status WHERE customer_order_status_id = ?';

        connection.acquire(function (err, con) {
            if (err) {
                res.json({
                    status: 100,
                    message: "Error in connection database"
                });
                return;
            }

            con.query(query, id, function (err, result) {
                con.release();
                if (err) {
                    res.json(err);
                } else {
                    if (result.length > 0) {
                        output = {
                            status: 1,
                            customer_order_status: result[0]
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No such customer order status found'
                        };
                    }
                    res.json(output);
                }
            });
        });
    };

    //create customer order status.
    this.create = function (customerOrderStatusObj, res) {
        var output = {},
            query = "INSERT iNTO customer_order_status(customer_order_status_name, customer_order_status_desc) VALUES(?,?)";
        var feedback, customer_order_status_name = customerOrderStatusObj.customer_order_status_name,
            customer_order_status_desc = customerOrderStatusObj.customer_order_status_desc;

        if ((undefined !== customer_order_status_name && customer_order_status_name != '') && (undefined !== customer_order_status_desc && customer_order_status_desc != '')) {
            connection.acquire(function (err, con) {
                if (err) {
                    res.json({
                        status: 100,
                        message: "Error in connection database"
                    });
                    return;
                }

                con.query(query, [customer_order_status_name, customer_order_status_desc], function (err, result) {
                    con.release();
                    if (err) {
                        res.json(err);
                    } else {
                        feedback = 'Customer order Status successfully created';
                        output = {
                            status: 1,
                            message: feedback,
                            createdCustomerOrderStatusId: result.insertId
                        };
                        res.json(output);
                    }
                });
            });
        } else {
            feedback = 'Invalid Customer order Status data submitted';
            output = {
                status: 0,
                message: feedback
            };
            res.json(output);
        }


    };

    //update customer order status.
    this.update = function (customerOrderStatusObj, res) {
        var output = {},
            queryFind = 'SELECT * FROM customer_order_status WHERE customer_order_status_id = ?',
            query = "UPDATE customer_order_status SET customer_order_status_name = ?, customer_order_status_desc = ? WHERE customer_order_status_id = ?";
        var feedback, customer_order_status_name = customerOrderStatusObj.customer_order_status_name,
            customer_order_status_desc = customerOrderStatusObj.customer_order_status_desc,
            customer_order_status_id = customerOrderStatusObj.customer_order_status_id;

        if ((undefined !== customer_order_status_name && customer_order_status_name != '') && (undefined !== customer_order_status_desc && customer_order_status_desc != '') && (undefined !== customer_order_status_id && customer_order_status_id != '')) {
            connection.acquire(function (err, con) {
                if (err) {
                    res.json({
                        status: 100,
                        message: "Error in connection database"
                    });
                    return;
                }

                con.query(queryFind, customer_order_status_id, function (err, result) {
                    con.release();
                    if (err) {
                        res.json(err);
                    } else {
                        if (result.length > 0) {
                            //Update.
                            connection.acquire(function (err, con) {
                                if (err) {
                                    res.json({
                                        status: 100,
                                        message: "Error in connection database"
                                    });
                                    return;
                                }

                                con.query(query, [customer_order_status_name, customer_order_status_desc, customer_order_status_id], function (err, result) {
                                    con.release();
                                    if (err) {
                                        res.json(err);
                                    } else {
                                        feedback = 'Customer order Status successfully updated';
                                        output = {
                                            status: 1,
                                            message: feedback,
                                            updatedCustomerOrderStatusName: customer_order_status_name
                                        };
                                        res.json(output);
                                    }
                                });
                            });
                        } else {
                            output = {
                                status: 0,
                                message: 'No Customer order Status with such Id found'
                            };
                            res.json(output);
                        }

                    }
                });
            });

        } else {
            feedback = 'Invalid Customer Status data submitted';
            output = {
                status: 0,
                message: feedback
            };
            res.json(output);
        }


    };
}

module.exports = new CustomerOrderStatus();