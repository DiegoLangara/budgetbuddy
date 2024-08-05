const { query } = require('./db');
const utility = require('./utilityFunctions');

// Goal Functions
const createGoal = (req, res) => {
  const { user_id } = req.headers;
  const { goal_name, goal_type_id, target_amount, current_amount, target_date } = req.body;

  const goalQuery = 'INSERT INTO goals (user_id, goal_name, goal_type_id, target_amount, current_amount, target_date) VALUES (?, ?, ?, ?, ?, ?)';
  const goalValues = [user_id, goal_name, goal_type_id, target_amount, current_amount, target_date];

  query(goalQuery, goalValues, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to create goal', error: err });
    }

    const goal_id = results.insertId;

    const accountQuery = 'INSERT INTO accounts (type_account, id_type_account, status_account, user_id, balance) VALUES (?, ?, ?, ?, ?)';
    const accountValues = ['goals', goal_id, 1, user_id, current_amount];

    query(accountQuery, accountValues, (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to create account for goal', error: err });
      }

      res.status(201).json({ success: true, message: 'Goal and account created ', goal_id: goal_id });
    });
  });
};


const getGoals = (req, res) => {
  const { user_id } = req.headers;

  const query2 = `
    SELECT g.*, gt.goal_type_name, ac.account_id
FROM goals g
JOIN goal_types gt ON g.goal_type_id = gt.goal_type_id
JOIN accounts ac ON ac.id_type_account = g.goal_id AND ac.type_account = ?
WHERE g.user_id = ?
ORDER BY g.goal_id DESC;
  `;

  query(query2, ['goals', user_id], (err, results) => {

    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch goals', error: err });
    }

    res.json(results);
  });
};

const getGoal = (req, res) => {
  const { user_id } = req.headers;
  const { goal_id } = req.headers;

  const query2 = `
    SELECT g.*, gt.goal_type_name, ac.account_id
FROM goals g
JOIN goal_types gt ON g.goal_type_id = gt.goal_type_id
JOIN accounts ac ON ac.id_type_account = g.goal_id AND ac.type_account = ?
WHERE g.user_id = ? AND g.goal_id = ?;
  `;

  query(query2, ['goals', user_id, goal_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch goal', error: err });
    }

    res.json(results[0]);
  });
};

const updateGoal = (req, res) => {
  const { user_id } = req.headers;
  const { goal_id } = req.headers;

  const data = req.body;
  const fields = [];
  const params = [];
  Object.keys(data).forEach(key => {
    fields.push(`${key} = ?`);
    params.push(data[key]);
  });
  params.push(user_id);
  params.push(goal_id);
  const query2 = `UPDATE goals SET ${fields.join(', ')} WHERE user_id = ? AND goal_id = ?`;

  query(query2, params, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to update goal', error: err });
    }

    // Update the balance in the accounts table
    if (data.current_amount !== undefined) {
      const accountQuery = `UPDATE accounts SET balance = ? WHERE id_type_account = ? AND type_account = "goals" AND user_id = ?`;
      query(accountQuery, [data.current_amount, goal_id, user_id], (err, results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to update account balance',
            error: err.message || err
          });
        }

        res.json({
          success: true,
          message: 'Goal and account balance updated ',
          goal_id: goal_id
        });
      });
    } else {
      res.json({
        success: true,
        message: 'Goal updated ',
        goal_id: goal_id
      });
    }
  });
};


const deleteGoal = (req, res) => {
  const { user_id, goal_id } = req.headers;

  const goalQuery = 'DELETE FROM goals WHERE user_id = ? AND goal_id = ?';
  const accountQuery = 'DELETE FROM accounts WHERE type_account = ? AND id_type_account = ? AND user_id = ?';

  query(goalQuery, [user_id, goal_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to delete goal', error: err });
    }

    query(accountQuery, ['goals', goal_id, user_id], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to delete account for goal', error: err });
      }

      res.json({ success: true, message: 'Goal and account deleted ' });
    });
  });
};

const getGoalTypes = (req, res) => {

  const query2 = 'SELECT * FROM goal_types';
  query(query2, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch goal types', error: err });
    }

    res.json(results);
  });

}

const syncGoals = async (req, res) => {
  //needs to sync the goals with the accounts table
  try {
    const userId = req.headers.user_id;
    const goals = req.body.goals;

    const goalIds = goals.filter(goal => goal.goal_id).map(goal => goal.goal_id);
    const resultSummary = {
      added: [],
      updated: [],
      deleted: [],
      notDeletable: []
    };

    // Get all current goals for the user 
    const currentGoals = await query('SELECT * FROM goals WHERE user_id = ?', [userId]);
    const currentGoalIds = currentGoals.map(goal => goal.goal_id);

    // Delete goals that are not listed in the request body
    for (const currentGoal of currentGoals) {
      if (!goalIds.includes(currentGoal.goal_id)) {
        if (currentGoal.deletable === 1) {
          await query('DELETE FROM goals WHERE goal_id = ? AND user_id = ?', [currentGoal.goal_id, userId]);
          await query('DELETE FROM accounts WHERE type_account = ? AND id_type_account = ? AND user_id = ?', ['goals', currentGoal.goal_id, userId]);
          resultSummary.deleted.push(currentGoal.goal_name);
        } else {
          resultSummary.notDeletable.push(currentGoal.goal_name);
        }
      }
    }

    // Process each goal in the request body
    for (const goal of goals) {
      const {
        goal_id,
        goal_name,
        goal_type_id,
        target_amount,
        current_amount,
        target_date
      } = goal;

      if (goal_id && currentGoalIds.includes(goal_id)) {
        // Update existing goal regardless of deletable status
        await query(
          'UPDATE goals SET goal_name = ?, goal_type_id = ?, target_amount = ?, current_amount = ?, target_date = ? WHERE goal_id = ? AND user_id = ?',
          [goal_name, goal_type_id, target_amount, current_amount, target_date, goal_id, userId]
        );
        await query('UPDATE accounts SET balance = ? WHERE type_account = ? AND id_type_account = ? AND user_id = ?', [current_amount, 'goals', goal_id, userId]);
        resultSummary.updated.push(goal_name);
      } else {
        // Insert new goal

        const insertResult = await query(
          'INSERT INTO goals (user_id, goal_name, goal_type_id, target_amount, current_amount, target_date) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, goal_name, goal_type_id, target_amount, current_amount, target_date]
        );
        //get goal_id of inserted goal
        const newGoalId = insertResult.insertId; // Get the inserted goal ID

        await query('INSERT INTO accounts (type_account, id_type_account, status_account, user_id, balance) VALUES (?, ?, ?, ?, ?)', ['goals', newGoalId, 1, userId, current_amount]);
        resultSummary.added.push(goal_name);

      }
    }

    res.status(200).json({
      success: true,
      message: `Goals saved `,
      details: `Added: ${resultSummary.added.length}, Updated: ${resultSummary.updated.length}, Deleted: ${resultSummary.deleted.length}, Not Deletable: ${resultSummary.notDeletable.length}`,
      summary: resultSummary
    });
  } catch (error) {
    console.error('Failed to sync goals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync goals',
      error: error.message || error
    });
  }
};


// Export all functions for debts
module.exports = {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  deleteGoal,
  getGoalTypes,
  syncGoals
};