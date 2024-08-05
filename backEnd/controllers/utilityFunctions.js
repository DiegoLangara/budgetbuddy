// Used for utility functions that are used in multiple controllers

const { query } = require('./db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const generateToken = () => {
  return crypto.randomBytes(16).toString('hex');
};


// utility functions
// calculate monthly equivalent of an amount based on the period
const calculateMonthlyEquivalent = (amount, period) => {
  switch (period) {
    case 'one-off':
      return amount;
    case 'daily':
      return amount * 20;
    case 'weekly':
      return amount * 4;
    case 'bi-weekly':
      return amount * 2;
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'annually':
      return amount / 12;
    default:
      throw new Error(`Unknown period: ${period}`);
  }
};

// check if user has an income account, create one if not
const checkAccountIncome = async (user_id) => {
  const accountQuery = 'SELECT * FROM accounts WHERE user_id = ? AND status_account = 1 AND type_account = "income"';
  const accountResults = await query(accountQuery, [user_id]);

  if (accountResults.length > 0) {
    return {
      account_id: accountResults[0].account_id,
      balance: accountResults[0].balance
    };
  } else {
    const createAccountQuery = 'INSERT INTO accounts (type_account, id_type_account, status_account, user_id, balance) VALUES (?, ?, ?, ?, ?)';
    const createAccountValues = ['income', 0, 1, user_id, 0];
    const createAccountResult = await query(createAccountQuery, createAccountValues);

    return {
      account_id: createAccountResult.insertId,
      balance: 0
    };
  }
};

// get account id and balance for a specific account type

const getAccount = async (user_id, type_id, type) => {
  let accountQuery = `
  SELECT ac.*, i.income_name as name
FROM accounts ac
left JOIN income i ON ac.id_type_account = i.income_id AND ac.type_account = 'income'
WHERE ac.user_id = ? AND ac.status_account = 1 AND ac.id_type_account = ?;`;

if(type == 'goals'){

  
  accountQuery = `
  SELECT ac.*, g.goal_name as name
FROM accounts ac
JOIN goals g ON ac.id_type_account = g.goal_id AND ac.type_account = 'goals'
WHERE ac.user_id = ? AND ac.status_account = 1 AND ac.id_type_account = ?;`;
}else if(type == 'debts'){
  accountQuery = `
  SELECT ac.*, d.debt_name as name
FROM accounts ac
JOIN debts d ON ac.id_type_account = d.debt_id AND ac.type_account = 'debts'
WHERE ac.user_id = ? AND ac.status_account = 1 AND ac.id_type_account = ?;`;
}else if(type == 'budgets'){
  accountQuery = `
  SELECT ac.*, b.budget_name as name
FROM accounts ac
JOIN budgets b ON ac.id_type_account = b.budget_id AND ac.type_account = 'budgets'
WHERE ac.user_id = ? AND ac.status_account = 1 AND ac.id_type_account = ?;`;
}

  const accountResults = await query(accountQuery, [user_id, type_id]);

  if (accountResults.length > 0) {
    return {
      account_id: accountResults[0].account_id,
      balance: accountResults[0].balance,
      name: accountResults[0].name
    };
  } else {
    return {
      account_id: null,
      balance: 0,
      name: null
    };
  }
}




//
module.exports = {

 
  calculateMonthlyEquivalent,
  checkAccountIncome,
  generateToken,
  getAccount,
 
};