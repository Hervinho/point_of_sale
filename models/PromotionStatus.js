const connection = require('../config/connection');

function PromotionStatus() {
    //get all promotion statuses.
    this.getAll = (res) => {
        let output = {},
            query = 'SELECT * FROM promotion_status';

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
                            promotion_statuses: result
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No promotion statuses found'
                        };
                    }
                    res.json(output);
                }
            });
        });
    };

    //get a single promotion status.
    this.getOne = (id, res) => {
        let output = {},
            query = 'SELECT * FROM promotion_status WHERE promotion_status_id = ?';

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
                            promotion_status: result[0]
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No such promotion status found'
                        };
                    }
                    res.json(output);
                }
            });
        });
    };

    //create promotion status.
    this.create = (promotionStatusObj, res) => {
        let output = {},
            query = "INSERT iNTO promotion_status(promotion_status_name, promotion_status_desc) VALUES(?,?)";
        let feedback, promotion_status_name = promotionStatusObj.promotion_status_name,
            promotion_status_desc = promotionStatusObj.promotion_status_desc;

        if ((undefined !== promotion_status_name && promotion_status_name != '') && (undefined !== promotion_status_desc && promotion_status_desc != '')) {
            connection.acquire(function (err, con) {
                if (err) {
                    res.json({
                        status: 100,
                        message: "Error in connection database"
                    });
                    return;
                }

                con.query(query, [promotion_status_name, promotion_status_desc], (err, result) => {
                    con.release();
                    if (err) {
                        res.json(err);
                    } else {
                        feedback = 'Promotion Status successfully created';
                        output = {
                            status: 1,
                            message: feedback,
                            createdPromotionStatusId: result.insertId
                        };
                        res.json(output);
                    }
                });
            });
        } else {
            feedback = 'Invalid Promotion Status data submitted';
            output = {
                status: 0,
                message: feedback
            };
            res.json(output);
        }


    };

    //update promotion status.
    this.update = (promotionStatusObj, res) => {
        let output = {},
            queryFind = 'SELECT * FROM promotion_status WHERE promotion_status_id = ?',
            query = "UPDATE promotion_status SET promotion_status_name = ?, promotion_status_desc = ? WHERE promotion_status_id = ?";
        let feedback, promotion_status_name = promotionStatusObj.promotion_status_name,
            promotion_status_desc = promotionStatusObj.promotion_status_desc,
            promotion_status_id = promotionStatusObj.promotion_status_id;

        if ((undefined !== promotion_status_name && promotion_status_name != '') && (undefined !== promotion_status_desc && promotion_status_desc != '') && (undefined !== promotion_status_id && promotion_status_id != '')) {
            connection.acquire((err, con) => {
                if (err) {
                    res.json({
                        status: 100,
                        message: "Error in connection database"
                    });
                    return;
                }

                con.query(queryFind, promotion_status_id, (err, result) => {
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

                                con.query(query, [promotion_status_name, promotion_status_desc, promotion_status_id], (err, result) => {
                                    con.release();
                                    if (err) {
                                        res.json(err);
                                    } else {
                                        feedback = 'Promotion Status successfully updated';
                                        output = {
                                            status: 1,
                                            message: feedback,
                                            updatedPromotionStatusName: promotion_status_name
                                        };
                                        res.json(output);
                                    }
                                });
                            });
                        } else {
                            output = {
                                status: 0,
                                message: 'No Promotion Status with such Id found'
                            };
                            res.json(output);
                        }

                    }
                });
            });

        } else {
            feedback = 'Invalid Promotion Status data submitted';
            output = {
                status: 0,
                message: feedback
            };
            res.json(output);
        }

    };
}

module.exports = new PromotionStatus();