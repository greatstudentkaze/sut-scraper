import { DayOfTheWeekType } from '../types';

export interface IScheduleItem {
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
  day: DayOfTheWeekType,
  lessons: IScheduleItem[],
}

export interface IWeekSchedule {
  week: number,
  days: IDaySchedule[],
}
