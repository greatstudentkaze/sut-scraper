import { IGoogleCalendarItem, IWeekSchedule } from '../interfaces';

export type DayOfTheWeekType = 'Понедельник' | 'Вторник' | 'Среда' | 'Четверг' | 'Пятница' | 'Суббота';

export type ScheduleType = IWeekSchedule[];

export type GoogleCalendarScheduleType = IGoogleCalendarItem[];

export type GroupCodeType = {
  [key: string]: string
};
