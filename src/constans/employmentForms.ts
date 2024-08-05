export interface IEmploymentForm {
  id: number;
  name: string;
  label: string;
}

export const employmentForms: IEmploymentForm[] = [
  {
    id: 1,
    name: 'unemployed',
    label: 'Безработный (укажите предыдущее место работы или сферу деятельности ниже)',
  },
  {
    id: 2,
    name: 'entrepreneur',
    label: 'ИП и самозанятость (укажите сферу деятельности ниже)',
  },
  {
    id: 3,
    name: 'employee',
    label: 'Наёмный работник',
  },
  {
    id: 4,
    name: 'businessOwner',
    label: 'Собственник бизнеса',
  },
  {
    id: 5,
    name: 'retired',
    label: 'Пенсионер',
  },
  {
    id: 6,
    name: 'student',
    label: 'Студент',
  },
  {
    id: 7,
    name: 'socialLeave',
    label: 'Социальный отпуск',
  },
  {
    id: 8,
    name: 'other',
    label: 'Другое...',
  },
];
