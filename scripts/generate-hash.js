const bcrypt = require('bcrypt');

// Generate a bcrypt hash for 'password123'
const plainPassword = 'password123';
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  console.log('Plain password:', plainPassword);
  console.log('Hashed password:', hash);
});