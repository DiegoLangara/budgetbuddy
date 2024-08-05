const { query } = require('./db');
const utility = require('./utilityFunctions');

//functions for incomes

const createIncome = async (req, res) => {
  const { user_id } = req.headers;
  const { period, income_type_id, amount, income_name, create_transaction } = req.body;

  try {
    const incomeQuery = 'INSERT INTO income (user_id, period, income_type_id, amount, income_name) VALUES (?, ?, ?, ?, ?)';
    const incomeValues = [user_id, period, income_type_id, amount, income_name];
    const incomeResult = await query(incomeQuery, incomeValues);
    const income_id = incomeResult.insertId;

    const accountInfo = await utility.checkAccountIncome(user_id);
    const monthlyEquivalent = utility.calculateMonthlyEquivalent(amount, period);
    const newBalance = accountInfo.balance + monthlyEquivalent;

    if (create_transaction) {
      const transactionQuery = `INSERT INTO transactions 
                                (user_id, transaction_payee, transaction_note, transaction_amount, transaction_image_url, transaction_date, account_id, transaction_type, transaction_category) 
                                VALUES (?, ?, ?, ?, ?, CONCAT(CURRENT_DATE, ' 00:00:00'), ?, ?, ?)`;
      const transactionValues = [
        user_id,
        income_name,
        'Added automatically from income projection',
        monthlyEquivalent,
        null,
        accountInfo.account_id,
        'deposit',
        'income'
      ];
      await query(transactionQuery, transactionValues);
    }

    const updateAccountQuery = 'UPDATE accounts SET balance = ? WHERE account_id = ?';
    await query(updateAccountQuery, [newBalance, accountInfo.account_id]);

    res.status(201).json({ success: true, message: 'Income created ', income_id: income_id });
  } catch (err) {
    console.error('Failed to create income:', err);
    res.status(500).json({ success: false, message: 'Failed to create income', error: err });
  }
};


const getIncomePeriods = (req, res) => {
  const query2 = 'SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "income" AND COLUMN_NAME = "period"';
  query(query2, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch income periods', error: err });
    }

    // Extract the enum values from the query result
    const enumRegex = /^enum\((.*)\)$/;
    const matches = enumRegex.exec(results[0].COLUMN_TYPE);
    if (matches) {
      const enumValues = matches[1].split(',').map(value => value.trim().slice(1, -1)); // Remove the enclosing quotes
      const formattedResults = enumValues.map(value => ({ period: value }));
      res.json(formattedResults);
    } else {
      res.status(500).json({ success: false, message: 'Failed to parse income periods' });
    }
  });
};

const getIncomes = (req, res) => {
  const { user_id } = req.headers;

  const query2 = `SELECT i.*, it.income_type_name, ac.account_id
FROM income i
JOIN income_types it ON i.income_type_id = it.income_type_id
JOIN accounts ac ON ac.type_account = ? AND ac.user_id = i.user_id
WHERE i.user_id = ?
ORDER BY i.income_id DESC;

  `;

  query(query2, ['income', user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch incomes', error: err });
    }

    res.json(results);
  });
};

const getIncome = (req, res) => {
  const { user_id } = req.headers;
  const { income_id } = req.headers;

  const query2 = `SELECT i.*, it.income_type_name, ac.account_id
FROM income i
JOIN income_types it ON i.income_type_id = it.income_type_id
JOIN accounts ac ON ac.type_account = ? AND ac.user_id = i.user_id
WHERE i.user_id = ? AND i.income_id = ?;

  `;

  query(query2, ['income', user_id, income_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch income', error: err });
    }

    res.json(results[0]);
  });
};

const updateIncome = (req, res) => {
  const { user_id } = req.headers;
  const { income_id } = req.headers;

  const data = req.body;
  const fields = [];
  const params = [];
  Object.keys(data).forEach(key => {

    fields.push(`${key} = ?`);
    params.push(data[key]);

  });
  params.push(user_id);
  params.push(income_id);
  const query2 = `UPDATE income SET ${fields.join(', ')} WHERE user_id = ? AND income_id = ?`;


  query(query2, params, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to update income', error: err });
    }

    res.json({ success: true, message: 'Income updated ', income_id: income_id });
  });
};

const deleteIncome = (req, res) => {
  const { user_id, income_id } = req.headers;

  const incomeQuery = 'DELETE FROM income WHERE user_id = ? AND income_id = ?';
  //  const accountQuery = 'DELETE FROM accounts WHERE type_account = ? AND id_type_account = ? AND user_id = ?';

  query(incomeQuery, [user_id, income_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to delete income', error: err });
    }

    // query(accountQuery, ['incomes', income_id, user_id], (err, results) => {
    // if (err) {
    // return res.status(500).json({ success: false, message: 'Failed to delete account for income', error: err });
    //}

    res.json({ success: true, message: 'Income deleted ' });
    //});
  });
};

const getIncomeTypes = (req, res) => {

  const query2 = 'SELECT * FROM income_types';
  query(query2, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch income types', error: err });
    }

    res.json(results);
  });

}

const syncIncomes = async (req, res) => {
  try {
    const userId = req.headers.user_id;
    const incomes = req.body.incomes;

    const incomeIds = incomes.filter(income => income.income_id).map(income => income.income_id);
    const resultSummary = {
      added: [],
      updated: [],
      deleted: [],
      notDeletable: []
    };

    // Get all current incomes for the user 
    const currentIncomes = await query('SELECT * FROM income WHERE user_id = ?', [userId]);
    const currentIncomeIds = currentIncomes.map(income => income.income_id);

    // Delete incomes that are not listed in the request body
    for (const currentIncome of currentIncomes) {
      if (!incomeIds.includes(currentIncome.income_id)) {
        if (currentIncome.deletable === 1) {
          await query('DELETE FROM income WHERE income_id = ? AND user_id = ?', [currentIncome.income_id, userId]);
          await query('DELETE FROM accounts WHERE type_account = ? AND id_type_account = ? AND user_id = ?', ['incomes', currentIncome.income_id, userId]);
          resultSummary.deleted.push(currentIncome.income_id);
        } else {
          resultSummary.notDeletable.push(currentIncome.income_id);
        }
      }
    }

    // Process each income in the request body
    for (const income of incomes) {
      const {
        income_id,
        period,
        income_type_id,
        amount,
        income_name,
        create_transaction // ensure this is part of the incoming data
      } = income;

      if (income_id && currentIncomeIds.includes(income_id)) {
        // Update existing income regardless of deletable status
        await query(
          'UPDATE income SET period = ?, income_type_id = ?, amount = ?, income_name = ? WHERE income_id = ? AND user_id = ?',
          [period, income_type_id, amount, income_name, income_id, userId]
        );

        resultSummary.updated.push(income_name);
      } else {
        // Insert new income
        const insertResult = await query(
          'INSERT INTO income (user_id, period, income_type_id, amount, income_name) VALUES (?, ?, ?, ?, ?)',
          [userId, period, income_type_id, amount, income_name]
        );
        const newIncomeId = insertResult.insertId;

        const create_transaction = true; //force to create transactions

        if (create_transaction) {
          const monthlyEquivalent = utility.calculateMonthlyEquivalent(amount, period);
          const accountInfo = await utility.checkAccountIncome(userId);
          const newBalance = parseFloat(accountInfo.balance) + parseFloat(monthlyEquivalent);

          const transactionQuery = `INSERT INTO transactions 
                                    (user_id, transaction_payee, transaction_note, transaction_amount, transaction_image_url, transaction_date, account_id, transaction_type, transaction_category) 
                                    VALUES (?, ?, ?, ?, ?, CONCAT(CURRENT_DATE, ' 00:00:00'), ?, ?, ?)`;
          const transactionValues = [
            userId,
            income_name,
            'Added automatically from income projection (' + newIncomeId + ')',
            monthlyEquivalent,
            null,
            accountInfo.account_id,
            'deposit',
            'income'
          ];
          await query(transactionQuery, transactionValues);

          const updateAccountQuery = 'UPDATE accounts SET balance = ? WHERE account_id = ?';
          await query(updateAccountQuery, [newBalance, accountInfo.account_id]);
        }


        resultSummary.added.push(income_name);
      }
    }

    res.status(200).json({
      success: true,
      message: `Incomes saved `,
      details: ` Added: ${resultSummary.added.length}, Updated: ${resultSummary.updated.length}, Deleted: ${resultSummary.deleted.length}, Not Deletable: ${resultSummary.notDeletable.length}`,
      summary: resultSummary
    });
  } catch (error) {
    console.error('Failed to sync incomes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync incomes',
      error: error.message || error
    });
  }
};


// Export all functions for debts
module.exports = {


  createIncome,
  getIncomes,
  getIncome,
  getIncomePeriods,
  updateIncome,
  deleteIncome,
  getIncomeTypes,
  syncIncomes,

};