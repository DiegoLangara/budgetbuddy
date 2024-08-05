// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  authenticateUser,
  validateToken,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getUserForProfile,

} = require('../controllers/userController');

const {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  deleteGoal,
  getGoalTypes,
  syncGoals

} = require('../controllers/goalsController');

const {
  createIncome,
  getIncomes,
  getIncome,
  updateIncome,
  deleteIncome,
  getIncomeTypes,
  getIncomePeriods,
  syncIncomes,

} = require('../controllers/incomeController');

const {
  createDebt,
  getDebts,
  getDebt,
  updateDebt,
  deleteDebt,
  getDebtTypes,
  syncDebts,

} = require('../controllers/debtController');

const {
  getBalance,
  getAccounts,
  getAccount
} = require('../controllers/accountController');
const {

  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  syncBudgets

} = require('../controllers/budgetController');

const {
  getGoalsWithStatus,
  getMonthlyIncome,
  getMonthlyBudgetExpenses,
  getMonthlyTotalExpenses,
  getExpendituresByCategory,
  getMonthlySavings,
  getMonthlyIncomeAndDebts,
  getLatestTransactions

} = require('../controllers/dashboardController');

// Routes for transactions
const {
  createTransaction,
  deleteTransaction,
  updateTransaction,
  getAllTransactions,
  getTransaction,
  getTransactionsByCategory,
  getTransactionsByType,
  getTransactionsByAccID,
  getTransactionsByPayee
} = require('../controllers/transactionController');

const{
  sendContactForm 
} = require('../controllers/mailerController');

//routes for users
router.post('/register', registerUser);
router.post('/auth', authenticateUser);
router.get('/users', validateToken, getUsers);
router.get('/user/', validateToken, getUser);
router.get('/user/profile', validateToken, getUserForProfile);
router.put('/user/', validateToken, updateUser);
router.delete('/user/', validateToken, deleteUser);


//routes for goals
router.post('/goal/', validateToken, createGoal); //create goal
router.get('/goals/', validateToken, getGoals); //get goals
router.get('/goal/types/', validateToken, getGoalTypes); //get goal types
router.get('/goal/', validateToken, getGoal); //get individual goal
router.put('/goal/', validateToken, updateGoal); //update goal
router.delete('/goal/', validateToken, deleteGoal); //delete goal
router.post('/goals/', validateToken, syncGoals); //sync goals


//routes for incomes
router.post('/income/', validateToken, createIncome); //create income
router.get('/incomes/', validateToken, getIncomes); //get incomes
router.get('/income/', validateToken, getIncome); //get individual income
router.put('/income/', validateToken, updateIncome); //update income
router.delete('/income/', validateToken, deleteIncome); //delete income
router.post('/incomes/', validateToken, syncIncomes); //sync incomes
router.get('/income/types/', validateToken, getIncomeTypes); //get income types
router.get('/income/periods/', validateToken, getIncomePeriods); //get income types

//routes for debts  
router.post('/debt/', validateToken, createDebt); //create debt
router.get('/debts/', validateToken, getDebts); //get debts
router.get('/debt/', validateToken, getDebt); //get individual debt
router.put('/debt/', validateToken, updateDebt); //update debt
router.delete('/debt/', validateToken, deleteDebt); //delete debt
router.post('/debts/', validateToken, syncDebts); //sync debts
router.get('/debt/types/', validateToken, getDebtTypes); //get debt types

//routes for budgets
router.post('/budget/', validateToken, createBudget); //create budget
router.get('/budgets/', validateToken, getBudgets); //get budgets
router.get('/budget/', validateToken, getBudget); //get individual budget
router.put('/budget/', validateToken, updateBudget); //update budget
router.delete('/budget/', validateToken, deleteBudget); //delete budget
router.post('/budgets/', validateToken, syncBudgets); //sync budgets

//routes for accounts
router.get('/balance/', validateToken, getBalance); //get balance
router.get('/accounts/', validateToken, getAccounts); //get accounts
router.get('/account/', validateToken, getAccount); //get individual account

// Routes for dashboard
router.get('/dashboard/goals', validateToken, getGoalsWithStatus);
router.get('/dashboard/income', validateToken, getMonthlyIncome);
router.get('/dashboard/budgetexpenses', validateToken, getMonthlyBudgetExpenses);
router.get('/dashboard/monthlyexpenses', validateToken, getMonthlyTotalExpenses);
router.get('/dashboard/expendituresbycategory', validateToken, getExpendituresByCategory);
router.get('/dashboard/monthlysavings', validateToken, getMonthlySavings);
router.get('/dashboard/incomeanddebts', validateToken, getMonthlyIncomeAndDebts);
router.get('/dashboard/transactions', validateToken, getLatestTransactions);


// Transaction routes
router.post('/transaction/', validateToken, createTransaction);
router.delete('/transaction/', validateToken, deleteTransaction);
router.put('/transaction/', validateToken, updateTransaction);
router.get('/transactions/', validateToken, getAllTransactions);
router.get('/transaction/', validateToken, getTransaction);
router.get('/transactions/category/:category', validateToken, getTransactionsByCategory);
router.get('/transactions/type/:type', validateToken, getTransactionsByType);
router.get('/transactions/account/:account_id', validateToken, getTransactionsByAccID);
router.get('/transactions/payee/:payee', validateToken, getTransactionsByPayee);


// route for email handling
router.post('/contact', sendContactForm);

// Export all routes

module.exports = router;