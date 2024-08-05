const { query } = require('./db');
const utility = require('./utilityFunctions');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ message_title: 'Oops...', message_text: 'Email and password are required.', message_icon: 'error', success: false });
  }

  query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database query failed.', error: err, message_icon: 'error', success: false });
    }

    if (results.length > 0) {
      return res.json({ message_title: 'Oops...', message_text: 'Email already exists in our records. Try logging in instead.', message_icon: 'error', success: false });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const query2 = 'INSERT INTO users (email, password) VALUES (?, ?)';
    const values = [email, hashedPassword];

    query(query2, values, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Registration failed',
          error: err,
          success: false,
          sql: `INSERT INTO users (email, password) VALUES ('${email}', '${hashedPassword}')`
        });
      }

      res.json({ message_title: 'Good Job!', message_text: 'User registered successfully.', message_icon: 'success', success: true });
    });
  });
};

// Authenticate a user
const authenticateUser = (req, res) => {
  const { email, password } = req.body;
  query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (results.length === 0 || !bcrypt.compareSync(password, results[0].password)) {
      return res.json({ message_title: 'Oops...', message_text: 'Invalid email or password', message_icon: 'error', success: false });
    }
    const token = utility.generateToken();
    const user_id = results[0].user_id;

    const onboarding = (results[0].onboarding ? true : false);
    query('UPDATE users SET token = ?, last_login = NOW() WHERE user_id = ?', [token, user_id], (err, results) => {
      res.json({ message_title: 'Well done!', message_text: 'Authentication successful', message_icon: 'success', success: true, token, user_id, onboarding });
    });
  });
};

// Validate a token
const validateToken = (req, res, next) => {
  const { user_id, token } = req.headers;
  //return res.status(403).json({ user_id: user_id});
  query('SELECT * FROM users WHERE user_id = ? AND token = ?', [user_id, token], (err, results) => {
    if (results.length === 0) {
      return res.status(403).json({ message: 'Sorry, you must provide a valid token for the current user to use the API', message_icon: 'error', success: false });
    }
    next();
  });
};

// Get all users
const getUsers = (req, res) => {
  query('SELECT * FROM users', (err, results) => {
    res.json(results);
  });
};

// Get a user
const getUser = (req, res) => {
  const user_id = req.headers.user_id;
  if (!user_id) {
    return res.status(400).json({ error: "user_id header is missing", message_icon: 'error', success: false });
  }
  const params = [user_id];
  query('SELECT user_id, firstname, lastname, email, dob, country, occupation FROM users WHERE user_id = ?', params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error", message_icon: 'error', success: false });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found", message_icon: 'error', success: false });
    }
    res.json(results[0]);
  });
};

// Get a user for Profile page
const getUserForProfile = (req, res) => {
  const user_id = req.headers.user_id;
  if (!user_id) {
    return res.status(400).json({ error: "user_id header is missing", message_icon: 'error', success: false });
  }
  const params = [user_id];
  query('SELECT user_id, firstname, lastname, email, aboutme, picture_url FROM users WHERE user_id = ?', params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error", message_icon: 'error', success: false });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found", message_icon: 'error', success: false });
    }
    res.json(results[0]);
  });
};

// Update a user
const updateUser = (req, res) => {
  const user_id = req.headers.user_id;
  const data = req.body;
  const fields = [];
  const params = [];
  Object.keys(data).forEach(key => {
    if (key === 'password') {
      fields.push(`${key} = ?`);
      params.push(bcrypt.hashSync(data[key], 10));
    } else {
      fields.push(`${key} = ?`);
      params.push(data[key]);
    }
  });
  params.push(user_id);
  query(`UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Update failed', message_icon: 'error', success: false });
    }
    res.json({ message: 'Personal details updated', message_icon: 'success', success: true });
  });
};


// Delete a user
const deleteUser = (req, res) => {
  const user_id = req.headers.user_id;
  query('DELETE FROM users WHERE user_id = ?', [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Deletion failed', message_icon: 'error', success: false });
    }
    res.json({ message: 'User deleted successfully', message_icon: 'success', success: true });
  });
};


// Export all functions for debts
module.exports = {
  registerUser,
  authenticateUser,
  validateToken,
  getUsers,
  getUser,
  getUserForProfile,
  updateUser,
  deleteUser,
};