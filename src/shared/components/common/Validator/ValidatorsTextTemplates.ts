export enum ValidatorsTypes {
  minOneOption = 'minOneOption',
  required = 'required',
  invalidEmail = 'invalidEmail',
  notUniqEmail = 'notUniqEmail',
  notValidPassword = 'notValidPassword',
  minLength_8 = 'minLength_8',
  minLength_9 = 'minLength_9',
  maxLength_9 = 'maxLength_9',
  maxLength_15 = 'maxLength_15',
  maxLength_50 = 'maxLength_50',
  maxLength_100 = 'maxLength_100',
  maxLength_200 = 'maxLength_200',
  maxLength_500 = 'maxLength_500',
  dateFormat = 'dateFormat',
  confirmPassword = 'confirmPassword',
  invalidDate = 'invalidDate',
  minDate = 'minDate',
}

export const validatorsTextTemplates = {
  minOneOption: () => 'Выберите хотя бы один пункт',
  required: (fieldName: string) => `Поле ${fieldName} обязательно для заполнения`,
  invalidEmail: (fieldName: string) => 'Некорректный формат email',
  notUniqEmail: (fieldName: string) => 'Email должен отличаться от введенного при регистрации',
  notValidPassword: (fieldName: string) =>
    'Используйте 8 или более символов с сочетанием заглавных и строчных букв, цифр и символов',
  minLength_8: (fieldName: string) => minLengthErrorText(fieldName, 8),
  minLength_9: (fieldName: string) => minLengthErrorText(fieldName, 9),
  maxLength_9: (fieldName: string) => maxLengthErrorText(fieldName, 9),
  maxLength_15: (fieldName: string) => maxLengthErrorText(fieldName, 15),
  maxLength_50: (fieldName: string) => maxLengthErrorText(fieldName, 50),
  maxLength_100: (fieldName: string) => maxLengthErrorText(fieldName, 100),
  maxLength_200: (fieldName: string) => maxLengthErrorText(fieldName, 200),
  maxLength_500: (fieldName: string) => maxLengthErrorText(fieldName, 500),
  dateFormat: (fieldName: string) => `Поле ${fieldName} должно быть иметь формат 'ДД-ММ-ГГГГ'`,
  invalidDate: (fieldName: string) => `Некорректное значение даты`,
  minDate: (fieldName: string) => `Минимальный возраст 16 лет`,
  confirmPassword: (fieldName: string) => `Значение должно совпадать со значением в поле Пароль`,
};

function minLengthErrorText(fieldName: string, min: number) {
  return `Поле ${fieldName} должно быть не короче ${min} символов`;
}

function maxLengthErrorText(fieldName: string, max: number) {
  return `Поле ${fieldName} должно быть не длиннее ${max} символов`;
}
