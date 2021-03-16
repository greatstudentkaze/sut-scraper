import { DayOfTheWeekType } from '../types';

export interface IScheduleItem {
  id: string,
  subject: string,
  teacher: string,
  type: string,
  classroom: string,
  time: {
    start: string,
    end: string,
  },
}

export interface IDaySchedule {
  id: string,
  day: DayOfTheWeekType,
  date: string,
  lessons: IScheduleItem[],
}

export interface IWeekSchedule {
  id: string,
  week: number,
  days: IDaySchedule[],
}
