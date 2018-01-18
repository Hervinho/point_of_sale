var connection = require('../config/connection');
var moment = require('moment');

function LoginRecord(){
    //get all login records.
    this.getAll = function (res) {
        var output = {},
            query = 'SELECT * FROM login_record LEFT JOIN employee ON login_record.employee_id = employee.employee_id';

        connection.acquire(function (err, con) {
            if (err) {
                res.json({
                    status: 100,
                    message: "Error connecting to database"
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
                            login_records: result
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No login records found'
                        };
                    }
                    res.json(output);
                }
            });
        });
    };

    //get all login records of a specific employee.
    this.getPerEmployee = function (employeeId, res) {
        var output = {},
            query = 'SELECT * FROM login_record LEFT JOIN employee ON login_record.employee_id = employee.employee_id ' +
                'WHERE login_record.employee_id = ?';

        connection.acquire(function (err, con) {
            if (err) {
                res.json({
                    status: 100,
                    message: "Error connecting to database"
                });
                return;
            }

            con.query(query, [employeeId], function (err, result) {
                con.release();
                if (err) {
                    res.json(err);
                } else {
                    if (result.length > 0) {
                        output = {
                            status: 1,
                            login_records: result
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No login records for this employee was found'
                        };
                    }
                    res.json(output);
                }
            });
        });
    };

    //get all login records for a specific day.
    this.getPerDate = function (date, res) {
        var output = {},
            query = 'SELECT * FROM login_record LEFT JOIN employee ON login_record.employee_id = employee.employee_id ' +
            'WHERE login_timestamp LIKE ?';
        //console.log(date);

        connection.acquire(function (err, con) {
            if (err) {
                res.json({
                    status: 100,
                    message: "Error connecting to database"
                });
                return;
            }

            con.query(query, ['%' + date + '%'], function (err, result) {
                con.release();
                if (err) {
                    ouptut = {
                        status: 0,
                        message: 'Error getting login records',
                        error: err
                    };
                    res.json(output);
                } else {
                    //console.log(result);
                    if (result.length > 0) {
                        output = {
                            status: 1,
                            login_records: result
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No login records for this date was found'
                        };
                    }
                    res.json(output);

                }
            });
        });

    };

    //get all login records for shift on a specific day.
    this.getPerDayAndShift = function (recordObj, res) {
        var output = {}, queryFindShift = 'SELECT * FROM shift WHERE shift_id = ?',
            query = 'SELECT * FROM login_record LEFT JOIN employee ON login_record.employee_id = employee.employee_id ' +
                'WHERE login_timestamp BETWEEN ? AND ?';
        var shift_id = recordObj.shift_id, date = recordObj.date;
        var start_date_time, end_date_time;

        if((undefined !== shift_id && shift_id != '') && (undefined !== date && date != '')){
            connection.acquire(function (err, con) {
                if (err) {
                    res.json({
                        status: 100,
                        message: "Error connecting to database"
                    });
                    return;
                }
    
                con.query(queryFindShift, [shift_id], function (err, result) {
                    con.release();
                    if (err) {
                        res.json(err);
                    } else {
                        if (result.length > 0) {
                            start_date_time = moment(date + ' ' + result[0].shift_start_time).format("YYYY-MM-DD HH:mm:ss");
                            end_date_time = moment(date + ' ' + result[0].shift_end_time).format("YYYY-MM-DD HH:mm:ss");
                            //console.log(start_date_time, end_date_time);
    
                            //Now get all logins during the date + shift that was provided.
                            connection.acquire(function (err, con) {
                                if (err) {
                                    res.json({
                                        status: 100,
                                        message: "Error connecting to database"
                                    });
                                    return;
                                }
                    
                                con.query(query, [start_date_time, end_date_time], function (err, resultLogins) {
                                    con.release();
                                    if (err) {
                                        res.json(err);
                                        return;
                                    } else {
                                        if (resultLogins.length > 0) {
                                            output = {
                                                status: 1,
                                                login_records: resultLogins
                                            };
    
                                            res.json(output);
                                            return;
                                        } else {
                                            output = {
                                                status: 0,
                                                message: 'No login records found for the date and shift provided'
                                            };
    
                                            res.json(output);
                                            return;
                                        }
                                        
                                    }
                                });
                            });
                        } else {
                            output = {
                                status: 0,
                                message: 'No such shift was found'
                            };
    
                            res.json(output);
                            return;
                        }
                    }
                });
            });
        }
        else{
            feedback = 'Invalid data submitted';
            output = {
                status: 0,
                message: feedback
            };

            res.json(output);
            return;
        }

    };

    //get all login records per date. from - to
    this.getPerFromDateToDate = function (dateObj, res) {
        var output = {}, date_from = dateObj.date_from, date_to = dateObj.date_to, 
            query = 'SELECT * FROM login_record LEFT JOIN employee ON login_record.employee_id = employee.employee_id ' +
            'WHERE login_timestamp BETWEEN ? AND ?';
        //console.log(date);

        connection.acquire(function (err, con) {
            if (err) {
                res.json({
                    status: 100,
                    message: "Error connecting to database"
                });
                return;
            }

            date_from = moment(date_from + ' ' + '00:00:00').format("YYYY-MM-DD HH:mm:ss");
            date_to = moment(date_to + ' ' + '23:59:59').format("YYYY-MM-DD HH:mm:ss");

            con.query(query, [date_from, date_to], function (err, result) {
                con.release();
                if (err) {
                    ouptut = {
                        status: 0,
                        message: 'Error getting login records',
                        error: err
                    };
                    res.json(output);
                } else {
                    //console.log(result);
                    if (result.length > 0) {
                        output = {
                            status: 1,
                            login_records: result
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No login records for this date range was found'
                        };
                    }
                    res.json(output);

                }
            });
        });

    };
}

module.exports = new LoginRecord();