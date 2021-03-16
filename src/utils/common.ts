import { nanoid } from 'nanoid';

import { IWeekSchedule } from '../interfaces';

// todo: add dayCreator
export const createWeekScheduleItem = (week: number): IWeekSchedule => ({
  id: nanoid(),
  week: week,
  days: [
    {
      id: nanoid(),
      date: '',
      day: 'Понедельник',
      lessons: []
    },
    {
      id: nanoid(),
      date: '',
      day: 'Вторник',
      lessons: []
    },
    {
      id: nanoid(),
      date: '',
      day: 'Среда',
      lessons: []
    },
    {
      id: nanoid(),
      date: '',
      day: 'Четверг',
      lessons: []
    },
    {
      id: nanoid(),
      date: '',
      day: 'Пятница',
      lessons: []
    },
    {
      id: nanoid(),
      date: '',
      day: 'Суббота',
      lessons: []
    },
  ]
});
