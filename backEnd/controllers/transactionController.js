// controllers/transactionController.js
const { query } = require('./db');
const utility = require('./utilityFunctions');
const { validateToken } = require('./userController'); // Assuming validateToken is exported from userController

const createTransaction = async (req, res) => {
  
  const { user_id } = req.headers;
  const { transaction_payee, transaction_note, transaction_amount, transaction_image_url, transaction_date, transaction_category, id_type_account } = req.body;

  try {
    let accountInfo;
    let newBalance;

    if (transaction_category === 'income') {
      accountInfo = await utility.checkAccountIncome(user_id);
      newBalance = parseFloat(accountInfo.balance) + parseFloat(transaction_amount);

      const accountInfoIncome = await utility.getAccount(user_id, 0, transaction_category);

      const newIncomeName = accountInfoIncome.name;
//console.log(accountInfo);
      const transactionQuery = `INSERT INTO transactions (user_id, transaction_payee, transaction_note, transaction_amount, transaction_image_url, transaction_date, account_id, transaction_type, transaction_category) VALUES (?, ?, ?, ?, ?, ?, ?, 'deposit', ?)`;
      const transactionValues = [
        user_id,
        (transaction_payee == null) ? newIncomeName : transaction_payee,
        transaction_note,
        parseFloat(transaction_amount),
        transaction_image_url,
        transaction_date,
        accountInfo.account_id,
        transaction_category
      ];
      await query(transactionQuery, transactionValues);

      const updateAccountQuery = 'UPDATE accounts SET balance = ? WHERE account_id = ?';
      await query(updateAccountQuery, [parseFloat(newBalance), accountInfo.account_id]);

    } else if (transaction_category === 'goals') {
      const accountInfoGoal = await utility.getAccount(user_id, id_type_account, transaction_category);
      //console.log(user_id, id_type_account, transaction_category);
      const newBalanceGoal = parseFloat(accountInfoGoal.balance) + parseFloat(transaction_amount);

      const newGoalName = accountInfoGoal.name;

      const accountInfoIncome = await utility.checkAccountIncome(user_id);
      const newBalanceIncome = parseFloat(accountInfoIncome.balance) - parseFloat(transaction_amount);

      const transactionQueryGoal = `INSERT INTO transactions (user_id, transaction_payee, transaction_note, transaction_amount, transaction_image_url, transaction_date, account_id, transaction_type, transaction_category) VALUES (?, ?, ?, ?, ?, ?, ?, 'deposit', ?)`;
      const transactionValuesGoal = [
        user_id,
        newGoalName,
        transaction_note,
        parseFloat(transaction_amount),
        transaction_image_url,
        transaction_date,
        accountInfoGoal.account_id,
        transaction_category,
        transaction_date
      ];
      await query(transactionQueryGoal, transactionValuesGoal);

      const transactionQueryIncome = `INSERT INTO transactions 
                                      (user_id, transaction_payee, transaction_note, transaction_amount, transaction_image_url, transaction_date, account_id, transaction_type, transaction_category) 
                                      VALUES (?, ?, ?, ?, ?, ?, ?, 'withdraw', 'income')`;
      const transactionValuesIncome = [
        user_id,
        newGoalName,
        transaction_note,
        -parseFloat(transaction_amount),
        transaction_image_url,
        transaction_date,
        accountInfoIncome.account_id,
        'income'
      ];
      await query(transactionQueryIncome, transactionValuesIncome);

      const updateAccountQueryGoal = 'UPDATE accounts SET balance = ? WHERE account_id = ?';
      await query(updateAccountQueryGoal, [parseFloat(newBalanceGoal), accountInfoGoal.account_id]);

      const updateAccountQueryIncome = 'UPDATE accounts SET balance = ? WHERE account_id = ?';
      await query(updateAccountQueryIncome, [parseFloat(newBalanceIncome), accountInfoIncome.account_id]);
    } else if (transaction_category === 'debts') {
      const accountInfoDebt = await utility.getAccount(user_id, id_type_account, transaction_category);
      const newBalanceDebt = parseFloat(accountInfoDebt.balance) + parseFloat(transaction_amount);

      const accountInfoIncome = await utility.checkAccountIncome(user_id);
      const newBalanceIncome = parseFloat(accountInfoIncome.balance) - parseFloat(transaction_amount);
      const newDebtName = accountInfoDebt.name;

      const transactionQueryDebt = `INSERT INTO transactions 
                                    (user_id, transaction_payee, transaction_note, transaction_amount, transaction_image_url, transaction_date, account_id, transaction_type, transaction_category) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, 'deposit', ?)`;
      const transactionValuesDebt = [
        user_id,
         newDebtName,
        transaction_note,
        parseFloat(transaction_amount),
        transaction_image_url,
        transaction_date,
        accountInfoDebt.account_id,
        transaction_category
      ];
      await query(transactionQueryDebt, transactionValuesDebt);

      const transactionQueryIncome = `INSERT INTO transactions 
                                      (user_id, transaction_payee, transaction_note, transaction_amount, transaction_image_url, transaction_date, account_id, transaction_type, transaction_category) 
                                      VALUES (?, ?, ?, ?, ?, ?, ?, 'withdraw', 'income')`;
      const transactionValuesIncome = [
        user_id,
        newDebtName,
        transaction_note,
        -parseFloat(transaction_amount),
        transaction_image_url,
        transaction_date,
        accountInfoIncome.account_id,
        'income'
      ];
      await query(transactionQueryIncome, transactionValuesIncome);

      const updateAccountQueryDebt = 'UPDATE accounts SET balance = ? WHERE account_id = ?';
      await query(updateAccountQueryDebt, [parseFloat(newBalanceDebt), accountInfoDebt.account_id]);

      const updateAccountQueryIncome = 'UPDATE accounts SET balance = ? WHERE account_id = ?';
      await query(updateAccountQueryIncome, [parseFloat(newBalanceIncome), accountInfoIncome.account_id]);
    } else if (transaction_category === 'budgets') {
      const accountInfoBudget = await utility.getAccount(user_id, id_type_account, transaction_category);
      const newBalanceBudget = parseFloat(accountInfoBudget.balance) + parseFloat(transaction_amount);

      const accountInfoIncome = await utility.checkAccountIncome(user_id);
      const newBalanceIncome = parseFloat(accountInfoIncome.balance) - parseFloat(transaction_amount);

      const newBudgetName = accountInfoBudget.name;

      const transactionQueryBudget = `INSERT INTO transactions 
                                      (user_id, transaction_payee, transaction_note, transaction_amount, transaction_image_url, transaction_date, account_id, transaction_type, transaction_category) 
                                      VALUES (?, ?, ?, ?, ?, ?, ?, 'expense', ?)`;
      const transactionValuesBudget = [
        user_id,
        (transaction_payee == null) ? newBudgetName : transaction_payee,
        transaction_note,
        parseFloat(transaction_amount),
        transaction_image_url,
        transaction_date,
        accountInfoBudget.account_id,
        transaction_category
      ];
      await query(transactionQueryBudget, transactionValuesBudget);

      const transactionQueryIncome = `INSERT INTO transactions 
                                      (user_id, transaction_payee, transaction_note, transaction_amount, transaction_image_url, transaction_date, account_id, transaction_type, transaction_category) 
                                      VALUES (?, ?, ?, ?, ?, ?, ?, 'withdraw', 'income')`;
      const transactionValuesIncome = [
        user_id,
        (transaction_payee == null) ? newBudgetName : transaction_payee,
        transaction_note,
        -parseFloat(transaction_amount),
        transaction_image_url,
        transaction_date,
        accountInfoIncome.account_id,
        'income'
      ];
      await query(transactionQueryIncome, transactionValuesIncome);

      const updateAccountQueryBudget = 'UPDATE accounts SET balance = ? WHERE account_id = ?';
      await query(updateAccountQueryBudget, [parseFloat(newBalanceBudget), accountInfoBudget.account_id]);

      const updateAccountQueryIncome = 'UPDATE accounts SET balance = ? WHERE account_id = ?';
      await query(updateAccountQueryIncome, [parseFloat(newBalanceIncome), accountInfoIncome.account_id]);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid transaction category' });
    }

    res.status(201).json({ success: true, message: 'Transaction created successfully' });
  } catch (err) {
    console.error('Failed to create transaction:', err);
    res.status(500).json({ success: false, message: 'Failed to create transaction', error: err });
  }
};

const deleteTransaction = async (req, res) => {
  const { user_id, transaction_id } = req.headers;

  try {
    const deleteQuery = 'DELETE FROM transactions WHERE transaction_id = ? AND user_id = ?';
    await query(deleteQuery, [transaction_id, user_id]);

    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Failed to delete transaction:', err);
    res.status(500).json({ success: false, message: 'Failed to delete transaction', error: err });
  }
};

const updateTransaction = async (req, res) => {
  const { user_id, transaction_id } = req.headers;
  const data = req.body;
  const fields = [];
  const params = [];
  Object.keys(data).forEach(key => {
    fields.push(`${key} = ?`);
    params.push(data[key]);
  });
  params.push(user_id);
  params.push(transaction_id);
  const queryStr = `UPDATE transactions SET ${fields.join(', ')} WHERE user_id = ? AND transaction_id = ?`;

  try {
    await query(queryStr, params);

    res.status(200).json({ success: true, message: 'Transaction updated successfully' });
  } catch (err) {
    console.error('Failed to update transaction:', err);
    res.status(500).json({ success: false, message: 'Failed to update transaction', error: err });
  }
};

const getAllTransactions = async (req, res) => {
    const { user_id, start_date, end_date } = req.headers;
  
    try {
      let transactions;
      if (start_date && end_date) {
        const queryStr = 'SELECT * FROM transactions WHERE user_id = ? AND transaction_date BETWEEN ? AND ? ORDER BY transaction_date DESC';
        transactions = await query(queryStr, [user_id, start_date, end_date]);
      } else {
        transactions = await query('SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC', [user_id]);
      }
  
      res.status(200).json(transactions);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: err });
    }
  };
  

const getTransaction = async (req, res) => {
  const { user_id, transaction_id } = req.headers;

  try {
    const transactions = await query('SELECT * FROM transactions WHERE user_id = ? AND transaction_id = ?', [user_id, transaction_id]);
    res.status(200).json(transactions[0]);
  } catch (err) {
    console.error('Failed to fetch transaction:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch transaction', error: err });
  }
};

const getTransactionsByCategory = async (req, res) => {
  const { user_id } = req.headers;
  const { category } = req.params;

  try {
    const transactions = await query('SELECT * FROM transactions WHERE user_id = ? AND transaction_category = ? ORDER BY transaction_date DESC', [user_id, category]);
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Failed to fetch transactions by category:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions by category', error: err });
  }
};

const getTransactionsByType = async (req, res) => {
  const { user_id } = req.headers;
  const { type } = req.params;

  try {
    const transactions = await query('SELECT * FROM transactions WHERE user_id = ? AND transaction_type = ? ORDER BY transaction_date DESC', [user_id, type]);
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Failed to fetch transactions by type:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions by type', error: err });
  }
};

const getTransactionsByAccID = async (req, res) => {
  const { user_id } = req.headers;
  const { account_id } = req.params;

  try {
    const transactions = await query('SELECT * FROM transactions WHERE user_id = ? AND account_id = ? ORDER BY transaction_date DESC', [user_id, account_id]);
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Failed to fetch transactions by account ID:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions by account ID', error: err });
  }
};

const getTransactionsByPayee = async (req, res) => {
  const { user_id } = req.headers;
  const { payee } = req.params;

  try {
    const transactions = await query('SELECT * FROM transactions WHERE user_id = ? AND transaction_payee = ? ORDER BY transaction_date DESC', [user_id, payee]);
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Failed to fetch transactions by payee:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions by payee', error: err });
  }
};

module.exports = {
  createTransaction,
  deleteTransaction,
  updateTransaction,
  getAllTransactions,
  getTransaction,
  getTransactionsByCategory,
  getTransactionsByType,
  getTransactionsByAccID,
  getTransactionsByPayee
};
