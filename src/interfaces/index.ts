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

export interface IGoogleCalendarItem {
  'Subject': string,
  'Start Date': string,
  'Start Time': string,
  'End Date': string,
  'End Time': string,
  'Description': string,
}
