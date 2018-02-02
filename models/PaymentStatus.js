const connection = require('../config/connection');

function PaymentStatus() {
    //get all payment statuses.
    this.getAll = (res) => {
        let output = {},
            query = 'SELECT * FROM payment_status';

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
                            payment_statuses: result
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No payment statuses found'
                        };
                    }
                    res.json(output);
                }
            });
        });
    };

    //get a single payment status.
    this.getOne = (id, res) => {
        let output = {},
            query = 'SELECT * FROM payment_status WHERE payment_status_id = ?';

        connection.acquire((err, con) => {
            if (err) {
                res.json({
                    status: 100,
                    message: "Error in connection database"
                });
                return;
            }

            con.query(query, id, (err, result) => {
                con.release();
                if (err) {
                    res.json(err);
                } else {
                    if (result.length > 0) {
                        output = {
                            status: 1,
                            payment_status: result[0]
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No such payment status found'
                        };
                    }
                    res.json(output);
                }
            });
        });
    };

    //create payment status.
    this.create = (paymentStatusObj, res) => {
        let output = {},
            query = "INSERT iNTO payment_status(payment_status_name, payment_status_desc) VALUES(?,?)";
        let feedback, payment_status_name = paymentStatusObj.payment_status_name,
            payment_status_desc = paymentStatusObj.payment_status_desc;

        if ((undefined !== payment_status_name && payment_status_name != '') && (undefined !== payment_status_desc && payment_status_desc != '')) {
            connection.acquire((err, con) => {
                if (err) {
                    res.json({
                        status: 100,
                        message: "Error in connection database"
                    });
                    return;
                }

                con.query(query, [payment_status_name, payment_status_desc], (err, result) => {
                    con.release();
                    if (err) {
                        res.json(err);
                    } else {
                        feedback = 'Payment Status successfully created';
                        output = {
                            status: 1,
                            message: feedback,
                            createdPaymentStatusId: result.insertId
                        };
                        res.json(output);
                    }
                });
            });
        } else {
            feedback = 'Invalid Payment Status data submitted';
            output = {
                status: 0,
                message: feedback
            };
            res.json(output);
        }


    };

    //update payment status.
    this.update = (paymentStatusObj, res) => {
        let output = {},
            queryFind = 'SELECT * FROM payment_status WHERE payment_status_id = ?',
            query = "UPDATE payment_status SET payment_status_name = ?, payment_status_desc = ? WHERE payment_status_id = ?";
        let feedback, payment_status_name = paymentStatusObj.payment_status_name,
            payment_status_desc = paymentStatusObj.payment_status_desc,
            payment_status_id = paymentStatusObj.payment_status_id;

        if ((undefined !== payment_status_name && payment_status_name != '') && (undefined !== payment_status_desc && payment_status_desc != '') && (undefined !== payment_status_id && payment_status_id != '')) {
            connection.acquire((err, con) => {
                if (err) {
                    res.json({
                        status: 100,
                        message: "Error in connection database"
                    });
                    return;
                }

                con.query(queryFind, payment_status_id, (err, result) => {
                    con.release();
                    if (err) {
                        res.json(err);
                    } else {
                        if (result.length > 0) {
                            //Update.
                            connection.acquire((err, con) => {
                                if (err) {
                                    res.json({
                                        status: 100,
                                        message: "Error in connection database"
                                    });
                                    return;
                                }

                                con.query(query, [payment_status_name, payment_status_desc, payment_status_id], (err, result) => {
                                    con.release();
                                    if (err) {
                                        res.json(err);
                                    } else {
                                        feedback = 'Payment Status successfully updated';
                                        output = {
                                            status: 1,
                                            message: feedback,
                                            updatedPaymentStatusName: payment_status_name
                                        };
                                        res.json(output);
                                    }
                                });
                            });
                        } else {
                            output = {
                                status: 0,
                                message: 'No Payment Status with such Id found'
                            };
                            res.json(output);
                        }

                    }
                });
            });

        } else {
            feedback = 'Invalid Payment Status data submitted';
            output = {
                status: 0,
                message: feedback
            };
            res.json(output);
        }


    };
}

module.exports = new PaymentStatus();