require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cool = require('cool-ascii-faces');
const userRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT || 5001;

const mysql = require('mysql');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

let db;

function handleDisconnect() {
  db = mysql.createConnection(dbConfig); // Recreate the connection, since the old one cannot be reused.

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the MySQL database:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect to avoid a hot loop.
    } else {
      console.log('Connected to the MySQL database.');
    }
  });

  db.on('error', (err) => {
    console.error('MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
      handleDisconnect(); // Reconnect if the connection is lost.
    } else {
      throw err;
    }
  });
}

handleDisconnect();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.get('/cool', (req, res) => res.send(cool()));
app.get('/times', (req, res) => res.send(showTimes()));
app.use('/api', userRoutes);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

function showTimes() {
  const times = process.env.TIMES || 5;
  let result = '';
  for (let i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}
