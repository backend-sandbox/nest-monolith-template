export const ENGLISH_LETTERS_AND_NUMBERS_REGEX = /^[A-Za-z0-9]+$/;
export const NO_SPECIAL_CHARS_REGEX = /^[^*|":<>[\]{}`\\()';@&$]*$/;
export const SPECIAL_CHARS_REGEX_FOR_PASSWORD = /[!@#$%^&*(),.?":{}|<>+=_-]/;
export const STRONG_PASSWORD_OPTIONS = {
  minLength: 7,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};
