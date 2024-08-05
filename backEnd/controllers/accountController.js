const { query } = require('./db');
const utility = require('./utilityFunctions');

// Get balance function
const getBalance = (req, res) => {
  const { user_id, type, id_type } = req.headers;

  let balanceQuery;
  let queryParams;
if(type == 'income'){
  balanceQuery = 'SELECT SUM(balance) AS result FROM accounts WHERE user_id = ? AND type_account = ?';
  queryParams = [user_id, type];
}else{
  if (id_type && id_type > 0) {
    balanceQuery = 'SELECT balance AS result FROM accounts WHERE user_id = ? AND type_account = ? AND id_type_account = ?';
    queryParams = [user_id, type, id_type];
  } else {
    balanceQuery = 'SELECT SUM(balance) AS result FROM accounts WHERE user_id = ? AND type_account = ?';
    queryParams = [user_id, type];
  }
}


  query(balanceQuery, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get balance',
        error: err.message || err
      });
    }

    if (!results[0]) {
      return res.status(200).json({
        success: true,
        balance: 0
      })

    }else{
      res.status(200).json({
        success: true,
        balance: results[0].result
      });
    }
  });
};

// Get accounts function
const getAccounts = (req, res) => {
  const { user_id, type } = req.headers;

  const accountsQuery = 'SELECT * FROM accounts WHERE user_id = ? AND type_account = ?';
  const queryParams = [user_id, type];

  query(accountsQuery, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get accounts',
        error: err.message || err
      });
    }

    res.status(200).json({
      success: true,
      accounts: results
    });
  });
};

// Get individual account function
const getAccount = (req, res) => {
  const { user_id, account_id } = req.headers;

  const accountQuery = 'SELECT * FROM accounts WHERE user_id = ? AND account_id = ?';
  const queryParams = [user_id, account_id];

  query(accountQuery, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get account',
        error: err.message || err
      });
    }

    res.status(200).json({
      success: true,
      account: results[0]
    });
  });
};

module.exports = {
  getBalance,
  getAccounts,
  getAccount
};
