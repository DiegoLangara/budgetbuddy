const { query } = require('./db');

// Function to get goals with status
const getGoalsWithStatus = async (req, res) => {
  const { user_id } = req.headers;

  try {
    const goals = await query(
      `SELECT	
        accounts.balance as balance, goals.* 
      FROM 
        accounts, goals 
      WHERE 
        goals.user_id = accounts.user_id 
      AND 
        goals.user_id = ? and goals.goal_id = id_type_account and type_account = ?
      `, [user_id, 'goals']
    );
    const currentDate = new Date();

    const formattedGoals = goals.map(goal => {
      const targetDate = new Date(goal.target_date);
      const status = targetDate > currentDate ? 'on time' : 'overdue';

      return {
        goal_id: goal.goal_id,
        goal_name: goal.goal_name,
        target_amount: goal.target_amount,
        // current_amount: goal.current_amount,
        current_amount: goal.balance,
        status: status
      };
    });

    res.json(formattedGoals);
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch goals', error: error.message || error });
  }
};

const getMonthlyBudgetExpenses = async (req, res) => {
  const { user_id, start_date, end_date } = req.headers;
  try {
    const budgetExpenses = await query(
      `SELECT 
        b.budget_name, SUM(t.transaction_amount) as expense, b.amount as budget_limit
      FROM 
        transactions t
      JOIN 
        accounts c ON c.account_id = t.account_id
      JOIN 
        budgets b ON b.budget_id = c.id_type_account
      WHERE 
        t.user_id = ? AND t.transaction_category = ?
      AND 
        t.transaction_date BETWEEN ? AND ?
      GROUP BY 
        b.budget_name, b.amount
      `, [user_id, 'budgets', start_date, end_date]
    );

    const formattedBudgetExpenses = budgetExpenses.map(exp => ({
      budget_name: exp.budget_name,
      expense: exp.expense,
      limit: exp.budget_limit
    }));

    res.json(formattedBudgetExpenses);
  } catch (error) {
    console.error('Failed to fetch budgets:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch budgets', error: error.message || error });
  }
};

// Function to get monthly expenses
const getMonthlyTotalExpenses = async (req, res) => {
  const { user_id } = req.headers;

  // Define the months of the year
  const monthsOfYear = getMonthsOfYear();

  try {
    // Fetch total expenses grouped by month for the current year
    const expenses = await query(
      `SELECT 
        DATE_FORMAT(transaction_date, "%Y-%m") as month, SUM(transaction_amount) as total_expense
      FROM 
        transactions
      WHERE 
        user_id = ?
      AND 
        transaction_type = 'expense'
      AND 
        YEAR(transaction_date) = YEAR(CURDATE())
      GROUP BY 
        month
      `, [user_id]
    );

    // Create a map of month numbers to total expenses
    const expensesMap = expenses.reduce((accumulator, currentValue) => {
      const monthNum = currentValue.month.split('-')[1];
      accumulator[monthNum] = currentValue.total_expense;
      return accumulator;
    }, {});

    // Prepare the final result by merging with monthsOfYear
    const result = monthsOfYear.map(monthObj => ({
      month: monthObj.month,
      total_expense: expensesMap[monthObj.num] || 0
    }));

    // Send the result as JSON response
    res.json(result);
  } catch (error) {
    console.error('Failed to fetch total expenses:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch total expenses', error: error.message || error });
  }
};

const getExpendituresByCategory = async (req, res) => {
  const { user_id, start_date, end_date } = req.headers;

  if (!user_id || !start_date || !end_date) {
    return res.status(400).json({ success: false, message: 'User ID, start date, and end date are required' });
  }

  try {
    const expenditures = await query(
      `SELECT 
        b.budget_name, SUM(t.transaction_amount) as expense
      FROM 
        transactions t
      JOIN 
        accounts c ON c.account_id = t.account_id
      JOIN 
        budgets b ON b.budget_id = c.id_type_account
      WHERE 
        t.user_id = ? 
      AND 
        t.transaction_category = ?
      AND 
        t.transaction_date BETWEEN ? AND ?
      GROUP BY 
        b.budget_name, b.amount
      `, [user_id, 'budgets', start_date, end_date]
    );

    const formattedExpenditures = expenditures.map(exp => ({
      budget_name: exp.budget_name,
      expense: exp.expense,
    }));

    res.json(formattedExpenditures);
  } catch (error) {
    console.error('Failed to fetch expenditures by category:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch expenditures by category', error: error.message || error });
  }
};

// Function to get monthly savings
const getMonthlySavings = async (req, res) => {
  const { user_id } = req.headers;

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  const monthsOfYear = getMonthsOfYear();

  const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
  const endOfYear = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];

  try {
    const savingsResults = await query(
      `SELECT 
        DATE_FORMAT(transaction_date, "%Y-%m") as month, SUM(transaction_amount) as total_savings
      FROM 
        transactions
      WHERE 
        user_id = ? 
      AND 
        transaction_category = ?
      AND 
        transaction_date BETWEEN ? AND ?
      GROUP BY 
        month
      `, [user_id, 'goals', startOfYear, endOfYear]
    );

    const savingsMap = savingsResults.reduce((accumulator, currentValue) => {
      const monthNum = currentValue.month.split('-')[1];
      accumulator[monthNum] = currentValue.total_savings;
      return accumulator;
    }, {});

    const result = monthsOfYear.map(monthObj => ({
      month: monthObj.month,
      total_savings: savingsMap[monthObj.num] || 0
    }));

    res.json(result);
  } catch (error) {
    console.error('Failed to fetch monthly savings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch monthly savings', error: error.message || error });
  }
};



// Function to get monthly income
const getMonthlyIncome = async (req, res) => {
  const { user_id } = req.headers;

  try {
    const incomes = await query(
      `SELECT
        * 
      FROM 
        income 
      WHERE 
        user_id = ?
      `, [user_id]
    );

    const monthlyIncomes = incomes.map(income => {
      let monthlyAmount;

      switch (income.period) {
        case 'one-off':
          monthlyAmount = income.amount;
          break;
        case 'daily':
          monthlyAmount = income.amount * 30;
          break;
        case 'weekly':
          monthlyAmount = income.amount * 4;
          break;
        case 'bi-weekly':
          monthlyAmount = income.amount * 2;
          break;
        case 'monthly':
          monthlyAmount = income.amount;
          break;
        case 'quarterly':
          monthlyAmount = income.amount / 3;
          break;
        case 'annually':
          monthlyAmount = income.amount / 12;
          break;
        default:
          monthlyAmount = 0;
          break;
      }

      return {
        category: income.income_name,
        amount: monthlyAmount
      };
    });

    res.json(monthlyIncomes);
  } catch (error) {
    console.error('Failed to fetch incomes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch incomes', error: error.message || error });
  }
};

// Function to get monthly income and debts
const getMonthlyIncomeAndDebts = async (req, res) => {
  const { user_id } = req.headers;

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
  const endOfYear = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];

  try {
    const income = await query(
      `SELECT 
        DATE_FORMAT(transaction_date, "%Y-%m") as month, SUM(transaction_amount) AS total_income,
      FROM 
        transactions
      WHERE 
        user_id = ? 
      AND 
        transaction_category = income
      GROUP BY 
        month
      `, [user_id, startOfYear, endOfYear]
    );

    const formattedIncomeAndDebts = income.map(item => ({
      month: item.month,
      income: item.total_income,
    }));

    res.json(formattedIncomeAndDebts);
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch goals', error: error.message || error });
  }
}

// Function to get the latest transactions
const getLatestTransactions = async (req, res) => {
  const { user_id } = req.headers;

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    const transactions = await query(
      `SELECT
        *
      FROM 
        transactions 
      WHERE 
        user_id = ?
      ORDER BY 
        transaction_date DESC 
      LIMIT 10
      `, user_id
    );

    res.status(200).json(transactions);
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: err });
  }
};

const getMonthsOfYear = () => {
  return [
    { month: "Jan", num: "01" },
    { month: "Feb", num: "02" },
    { month: "Mar", num: "03" },
    { month: "Apr", num: "04" },
    { month: "May", num: "05" },
    { month: "Jun", num: "06" },
    { month: "Jul", num: "07" },
    { month: "Aug", num: "08" },
    { month: "Sep", num: "09" },
    { month: "Oct", num: "10" },
    { month: "Nov", num: "11" },
    { month: "Dec", num: "12" },
  ];
}

module.exports = {
  getGoalsWithStatus,
  getMonthlyIncome,
  getMonthlyBudgetExpenses,
  getMonthlyTotalExpenses,
  getExpendituresByCategory,
  getMonthlySavings,
  getMonthlyIncomeAndDebts,
  getLatestTransactions
};
