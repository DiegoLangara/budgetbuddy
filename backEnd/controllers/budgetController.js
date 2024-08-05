
const { query } = require('./db');
const utility = require('./utilityFunctions');

// Budget Functions
// Create budget function
const createBudget = (req, res) => {
  const { user_id } = req.headers;
  const { budget_name, amount, end_date } = req.body;
  const start_date = new Date().toISOString().split('T')[0];


  const budgetQuery = 'INSERT INTO budgets (user_id, budget_name, amount, start_date, end_date) VALUES (?, ?, ?, ?, ?)';
  const budgetValues = [user_id, budget_name, amount, start_date, end_date];

  query(budgetQuery, budgetValues, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create budget',
        error: err.message || err
      });
    }

    const budget_id = results.insertId;
    const accountQuery = 'INSERT INTO accounts (type_account, id_type_account, status_account, user_id) VALUES (?, ?, ?, ?)';
    const accountValues = ['budgets', budget_id, 1, user_id];

    query(accountQuery, accountValues, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to create account for budget',
          error: err.message || err
        });
      }

      res.status(201).json({
        success: true,
        message: 'Budget created ',
        budget_id: budget_id
      });
    });
  });
};

const getBudgets = (req, res) => {
  const { user_id } = req.headers;

  const query2 = `SELECT b.*, ac.account_id
FROM budgets b
JOIN accounts ac ON ac.id_type_account = b.budget_id AND ac.type_account = ?
WHERE b.user_id = ?
ORDER BY b.budget_id DESC;`;

  query(query2, ['budgets', user_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get budgets',
        error: err.message || err
      });
    }

    res.status(200).json(results);
  });
};

const getBudget = (req, res) => {
  const { user_id } = req.headers;
  const { budget_id } = req.headers;

  const query2 = `SELECT b.*, ac.account_id
FROM budgets b
JOIN accounts ac ON ac.id_type_account = b.budget_id AND ac.type_account = ?
WHERE b.user_id = ? AND b.budget_id = ?`;

  query(query2, ['budgets', user_id, budget_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get budget',
        error: err.message || err
      });
    }

    res.status(200).json(results[0]);
  });
};

const updateBudget = (req, res) => {
  const { user_id } = req.headers;
  const { budget_id } = req.headers;

  const data = req.body;
  const fields = [];
  const params = [];
  Object.keys(data).forEach(key => {
    fields.push(`${key} = ?`);
    params.push(data[key]);
  });
  params.push(user_id);
  params.push(budget_id);
  const query2 = `UPDATE budgets SET ${fields.join(', ')} WHERE user_id = ? AND budget_id = ?`;

  query(query2, params, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update budget',
        error: err.message || err
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget updated ',
      budget_id: budget_id
    });
  });
};

const deleteBudget = (req, res) => {
  const { user_id, budget_id } = req.headers;

  const checkDeletableQuery = 'SELECT * FROM budgets WHERE user_id = ? AND budget_id = ? AND deletable = 1';
  const budgetQuery = 'DELETE FROM budgets WHERE user_id = ? AND budget_id = ?';
  const accountQuery = 'DELETE FROM accounts WHERE type_account = ? AND id_type_account = ? AND user_id = ?';

  query(checkDeletableQuery, [user_id, budget_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error checking if budget is deletable',
        error: err.message || err
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget cannot be deleted because it is not marked as deletable',
      });
    }

    query(budgetQuery, [user_id, budget_id], (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to delete budget',
          error: err.message || err
        });
      }

      query(accountQuery, ['budgets', budget_id, user_id], (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to delete associated account',
            error: err.message || err
          });
        }

        res.status(200).json({
          success: true,
          message: 'Budget deleted ',
          budget_id: budget_id
        });
      });
    });
  });
};

// Sync budgets function would be similar to syncbudgets, adapted for budgets.
const syncBudgets = async (req, res) => {
  try {
    const userId = req.headers.user_id;
    const budgets = req.body.budgets;

    const budgetIds = budgets.filter(budget => budget.budget_id).map(budget => budget.budget_id);
    const resultSummary = {
      added: [],
      updated: [],
      deleted: [],
      notDeletable: []
    };

    // Get all current budgets for the user 
    const currentbudgets = await query('SELECT * FROM budgets WHERE user_id = ?', [userId]);
    const currentbudgetIds = currentbudgets.map(budget => budget.budget_id);

    // Delete budgets that are not listed in the request body
    for (const currentbudget of currentbudgets) {
      if (!budgetIds.includes(currentbudget.budget_id)) {
        if (currentbudget.deletable === 1) {
          await query('DELETE FROM budgets WHERE budget_id = ? AND user_id = ?', [currentbudget.budget_id, userId]);
          await query('DELETE FROM accounts WHERE type_account = ? AND id_type_account = ? AND user_id = ?', ['budgets', currentbudget.budget_id, userId]);
          resultSummary.deleted.push(currentbudget.budget_id);
        } else {
          resultSummary.notDeletable.push(currentbudget.budget_id);
        }
      }
    }

    // Process each budget in the request body
    for (const budget of budgets) {
      const {
        budget_id,
        budget_name,
        amount,
        end_date
      } = budget;

      if (budget_id && currentbudgetIds.includes(budget_id)) {
        // Update existing budget regardless of deletable status
        await query(
          'UPDATE budgets SET budget_name = ?, amount = ?, end_date = ? WHERE budget_id = ? AND user_id = ?',
          [budget_name, amount, end_date, budget_id, userId]
        );
        resultSummary.updated.push(budget_id);
      } else {
        // Insert new budget
        const start_date = new Date().toISOString().split('T')[0];

        const insertResult = await query(
          'INSERT INTO budgets (user_id, budget_name, amount, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
          [userId, budget_name, amount, start_date, end_date]
        );
        const newbudgetId = insertResult.insertId; // Get the inserted budget ID

        await query('INSERT INTO accounts (type_account, id_type_account, status_account, user_id) VALUES (?, ?, ?, ?)', ['budgets', newbudgetId, 1, userId]);
        resultSummary.added.push(newbudgetId);
      }
    }

    res.status(200).json({
      success: true,
      message: `Budgets saved `,
      details: ` Added: ${resultSummary.added.length}, Updated: ${resultSummary.updated.length}, Deleted: ${resultSummary.deleted.length}, Not Deletable: ${resultSummary.notDeletable.length}`,
      summary: resultSummary
    });
  } catch (error) {
    console.error('Failed to sync budgets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync budgets',
      error: error.message || error
    });
  }
};



// Export all functions for budgets
module.exports = {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  syncBudgets
};