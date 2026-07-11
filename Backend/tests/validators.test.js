const { isValidPassword } = require('../utils/validators');

describe('isValidPassword', () => {
  test('rejects passwords shorter than 6 characters', () => {
    expect(isValidPassword('123')).toBe(false);
  });

  test('accepts passwords 6 characters or longer', () => {
    expect(isValidPassword('123456')).toBe(true);
  });

  test('rejects non-string input', () => {
    expect(isValidPassword(undefined)).toBe(false);
  });
});