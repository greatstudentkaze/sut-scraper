import { DayOfTheWeekType } from '../types';

export interface IClass {
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
  date: string,
  classes: IClass[],
}

export interface IWeekSchedule {
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
