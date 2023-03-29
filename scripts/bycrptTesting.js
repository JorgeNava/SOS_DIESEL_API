const bcrypt = require('bcrypt');

// Hash a password using bcrypt
async function hashPassword(password) {
  console.log('[NAVA] password :', password);
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('[NAVA] hashedPassword :', hashedPassword);
  return hashedPassword;
}

// Compare an input password with a hashed password
async function comparePasswords(inputPassword, hashedPassword) {
  const match = await bcrypt.compare(inputPassword, hashedPassword);
  return match;
}

// Example usage:
async function example() {
  const password = 'xkG#d6@pL9!z';

  // Hash the password
  const hashedPassword = await hashPassword(password);
  console.log('Hashed password:', hashedPassword);

  // Compare the input password with the hashed password
  const inputPassword = 'wrongpassword';
  const match = await comparePasswords(inputPassword, hashedPassword);
  console.log('Passwords match:', match);

  const correctInputPassword = 'xkG#d6@pL9!z';
  const correctMatch = await comparePasswords(
    correctInputPassword,
    hashedPassword
  );
  console.log('Correct passwords match:', correctMatch);
}

example();
