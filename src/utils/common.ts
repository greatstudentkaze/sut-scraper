import { IWeekSchedule } from '../interfaces';

export const createWeekScheduleItem = (week: number): IWeekSchedule => ({
  week: week,
  days: [
    {
      day: 'Понедельник',
      lessons: []
    },
    {
      day: 'Вторник',
      lessons: []
    },
    {
      day: 'Среда',
      lessons: []
    },
    {
      day: 'Четверг',
      lessons: []
    },
    {
      day: 'Пятница',
      lessons: []
    },
    {
      day: 'Суббота',
      lessons: []
    },
  ]
});
