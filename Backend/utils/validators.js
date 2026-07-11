function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

module.exports = { isValidPassword };