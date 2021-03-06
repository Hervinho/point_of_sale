const connection = require('../config/connection');

function AccountType() {

    //get all account types.
    this.getAll = (res) => {
        let output = {},
            query = 'SELECT * FROM account_type';

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
                            account_types: result
                        };
                    } else {
                        output = {
                            status: 0,
                            message: 'No account types found'
                        };
                    }
                    res.json(output);
                }
            });
        });
    };

}

module.exports = new AccountType();