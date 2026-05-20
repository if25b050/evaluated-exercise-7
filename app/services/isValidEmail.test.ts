import { isValidEmail } from "./isValidEmail";
import { expect, test } from '@jest/globals';

test('isValidEmail returns true for valid email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
});

test('isValidEmail returns false for invalid email addresses', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
});
