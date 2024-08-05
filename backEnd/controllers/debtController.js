const { query } = require('./db');
const utility = require('./utilityFunctions');

//create all functions for debts

const createDebt = (req, res) => {
  const { user_id } = req.headers;
  const { debt_name, debt_types_id, amount, due_date } = req.body;

  const debtQuery = 'INSERT INTO debts (user_id, debt_name, debt_types_id, amount, due_date) VALUES (?, ?, ?, ?, ?)';
  const debtValues = [user_id, debt_name, debt_types_id, amount, due_date];

  query(debtQuery, debtValues, (err, results) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to create debt',
        error: err.message || err
      });
    }

    const debt_id = results.insertId;
    const new_amount = amount * -1;
    const accountQuery = 'INSERT INTO accounts (type_account, id_type_account, status_account, user_id, balance) VALUES (?, ?, ?, ?, ?)';
    const accountValues = ['debts', debt_id, 1, user_id, new_amount];

    query(accountQuery, accountValues, (err, results) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Failed to create debt',
          error: err.message || err
        });
      }

      res.status(201).json({
        success: true,
        message: 'Debt created ',
        debt_id: debt_id
      });
    });
  });
};

const getDebts = (req, res) => {
  const { user_id } = req.headers;

  const query2 = `
    SELECT d.*, dt.debt_types_name, ac.account_id
FROM debts d
JOIN debt_types dt ON d.debt_types_id = dt.debt_types_id
JOIN accounts ac ON ac.id_type_account = d.debt_id AND ac.type_account = ?
WHERE d.user_id = ?
ORDER BY d.debt_id DESC;
  `;

  query(query2, ['debts', user_id], (err, results) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to get debts',
        error: err.message || err
      });
    }

    res.status(200).json(results);
  });
};

const getDebt = (req, res) => {
  const { user_id } = req.headers;
  const { debt_id } = req.headers;

  const query2 = `
    SELECT d.*, dt.debt_types_name, ac.account_id
FROM debts d
JOIN debt_types dt ON d.debt_types_id = dt.debt_types_id
JOIN accounts ac ON ac.id_type_account = d.debt_id AND ac.type_account = ?
WHERE d.user_id = ? AND d.debt_id = ?;
  `;

  query(query2, ['debts', user_id, debt_id], (err, results) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to get debt',
        error: err.message || err
      });
    }

    res.status(200).json(results[0]);
  });
};

const updateDebt = (req, res) => {
  const { user_id } = req.headers;
  const { debt_id } = req.headers;

  const data = req.body;
  const fields = [];
  const params = [];
  Object.keys(data).forEach(key => {
    fields.push(`${key} = ?`);
    params.push(data[key]);
  });
  params.push(user_id);
  params.push(debt_id);
  const query2 = `UPDATE debts SET ${fields.join(', ')} WHERE user_id = ? AND debt_id = ?`;

  query(query2, params, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update debt',
        error: err.message || err
      });
    }

    // Update the balance in the accounts table
    if (data.amount !== undefined) {
      const accountQuery = `UPDATE accounts SET balance = ? WHERE id_type_account = ? AND type_account = "debts" AND user_id = ?`;
      query(accountQuery, [data.amount, debt_id, user_id], (err, results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to update account balance',
            error: err.message || err
          });
        }

        res.status(200).json({
          success: true,
          message: 'Debt and account balance updated ',
          debt_id: debt_id
        });
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Debt updated ',
        debt_id: debt_id
      });
    }
  });
};


const deleteDebt = (req, res) => {
  const { user_id, debt_id } = req.headers;

  // Query to check if the debt is deletable
  const checkDeletableQuery = 'SELECT * FROM debts WHERE user_id = ? AND debt_id = ? AND deletable = 1';

  // Queries for deletion
  const debtQuery = 'DELETE FROM debts WHERE user_id = ? AND debt_id = ?';
  const accountQuery = 'DELETE FROM accounts WHERE type_account = ? AND id_type_account = ? AND user_id = ?';

  // First, check if the debt is deletable
  query(checkDeletableQuery, [user_id, debt_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error checking if debt is deletable',
        error: err.message || err
      });
    }

    // If no rows returned, the debt is not deletable
    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debt cannot be deleted because it is not marked as deletable',
      });
    }

    // If the debt is deletable, proceed with deletion
    query(debtQuery, [user_id, debt_id], (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to delete debt',
          error: err.message || err
        });
      }

      // Proceed to delete associated account
      query(accountQuery, ['debts', debt_id, user_id], (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to delete associated account',
            error: err.message || err
          });
        }

        // Success response
        res.status(200).json({
          success: true,
          message: 'Debt deleted ',
          debt_id: debt_id
        });
      });
    });
  });
};

const getDebtTypes = (req, res) => {
  const query2 = 'SELECT * FROM debt_types';

  query(query2, (err, results) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to get debt types',
        error: err.message || err
      });
    }

    res.status(200).json(results);
  });
};

const syncDebts = async (req, res) => {
  try {
    const userId = req.headers.user_id;
    const debts = req.body.debts;

    const debtIds = debts.filter(debt => debt.debt_id).map(debt => debt.debt_id);
    const resultSummary = {
      added: [],
      updated: [],
      deleted: [],
      notDeletable: []
    };

    // Get all current debts for the user 
    const currentDebts = await query('SELECT * FROM debts WHERE user_id = ?', [userId]);
    const currentDebtIds = currentDebts.map(debt => debt.debt_id);

    // Delete debts that are not listed in the request body
    for (const currentDebt of currentDebts) {
      if (!debtIds.includes(currentDebt.debt_id)) {
        if (currentDebt.deletable === 1) {
          await query('DELETE FROM debts WHERE debt_id = ? AND user_id = ?', [currentDebt.debt_id, userId]);
          await query('DELETE FROM accounts WHERE type_account = ? AND id_type_account = ? AND user_id = ?', ['debts', currentDebt.debt_id, userId]);
          resultSummary.deleted.push(currentDebt.debt_id);
        } else {
          resultSummary.notDeletable.push(currentDebt.debt_id);
        }
      }
    }

    // Process each debt in the request body
    for (const debt of debts) {
      const {
        debt_id,
        debt_name,
        debt_types_id,
        amount,
        due_date
      } = debt;

      if (debt_id && currentDebtIds.includes(debt_id)) {
        // Update existing debt regardless of deletable status
        await query(
          'UPDATE debts SET debt_name = ?, debt_types_id = ?, amount = ?, due_date = ? WHERE debt_id = ? AND user_id = ?',
          [debt_name, debt_types_id, amount, due_date, debt_id, userId]
        );
        await query(
          'UPDATE accounts SET balance = ? WHERE id_type_account = ? AND type_account = "debts" AND user_id = ?',
          [amount, debt_id, userId]
        );
        resultSummary.updated.push(debt_id);
      } else {
        // Insert new debt
        const insertResult = await query(
          'INSERT INTO debts (user_id, debt_name, debt_types_id, amount, due_date) VALUES (?, ?, ?, ?, ?)',
          [userId, debt_name, debt_types_id, amount, due_date]
        );
        const newDebtId = insertResult.insertId; // Get the inserted debt ID
        const new_amount = amount * -1;
        await query('INSERT INTO accounts (type_account, id_type_account, status_account, user_id, balance) VALUES (?, ?, ?, ?, ?)', ['debts', newDebtId, 1, userId, new_amount]);
        resultSummary.added.push(newDebtId);
        // Update onboarding status to take users to dashboard on next login
        
        

      }
    }

    await query('UPDATE users SET `onboarding` = ? WHERE `user_id` = ?', [ 0, userId]);
    
    res.status(200).json({
      success: true,
      message: `Debts saved `,
      details: `Added: ${resultSummary.added.length}, Updated: ${resultSummary.updated.length}, Deleted: ${resultSummary.deleted.length}, Not Deletable: ${resultSummary.notDeletable.length}`,
      summary: resultSummary
    });
  } catch (error) {
    console.error('Failed to sync debts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync debts',
      error: error.message || error
    });
  }
};

// Export all functions for debts
module.exports = {
  createDebt,
  getDebts,
  getDebt,
  updateDebt,
  deleteDebt,
  getDebtTypes,
  syncDebts,
};