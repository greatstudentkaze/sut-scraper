import { IWeekSchedule } from '../interfaces';

// todo: add dayCreator
export const createWeekScheduleItem = (week: number): IWeekSchedule => ({
  week: week,
  days: [
    {
      date: '',
      day: 'Понедельник',
      classes: []
    },
    {
      date: '',
      day: 'Вторник',
      classes: []
    },
    {
      date: '',
      day: 'Среда',
      classes: []
    },
    {
      date: '',
      day: 'Четверг',
      classes: []
    },
    {
      date: '',
      day: 'Пятница',
      classes: []
    },
    {
      date: '',
      day: 'Суббота',
      classes: []
    },
  ]
});
