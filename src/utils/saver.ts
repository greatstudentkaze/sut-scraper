import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import { IDaySchedule, IScheduleItem, IWeekSchedule } from '../interfaces';
import { GoogleCalendarScheduleType } from '../types';

const timeOptions: DateTimeFormatOptions = {
  timeZone: 'UTC',
  hour12: true,
  hour: 'numeric',
  minute: 'numeric'
};

const formatTime = (time: string, timeOptions: DateTimeFormatOptions): string =>
  new Date('1970-01-01T' + time + 'Z')
    .toLocaleTimeString('en-US', timeOptions);

const formatDate = (date: string): string => {
  const dateItems = date.split('.').reverse();
  const currentYear = new Date().getFullYear().toString();

  dateItems.push(currentYear);

  return dateItems.join('/');
};

export const getLessonsForTheDay = (lessonItems: IScheduleItem[], date: string): GoogleCalendarScheduleType =>
  lessonItems.reduce((lessons: GoogleCalendarScheduleType, item) => {
    const { subject, time, type } = item;

    if (subject === 'Военная подготовка') {
      return lessons;
    }

    const startTime = formatTime(time.start, timeOptions);
    const endTime = formatTime(time.end, timeOptions);

    return [
      ...lessons,
      {
        'Subject': subject,
        'Start Date': date,
        'Start Time': startTime,
        'End Date': date,
        'End Time': endTime,
        'Description': type,
      }
    ];
  }, []);

export const getLessonsForTheWeek = (dayItems: IDaySchedule[]): GoogleCalendarScheduleType =>
  dayItems.reduce((dayLessons: GoogleCalendarScheduleType, { lessons, date }) => {

    if (lessons.length) {
      date = formatDate(date);

      return [
        ...dayLessons,
        ...getLessonsForTheDay(lessons, date)
      ]
    }

    return dayLessons;
  }, []);

export const getLessonsForTheWeeks = (weekItems: IWeekSchedule[]): GoogleCalendarScheduleType =>
  weekItems.reduce((weekLessons: GoogleCalendarScheduleType, { days }: IWeekSchedule) => ([
    ...weekLessons,
    ...getLessonsForTheWeek(days)
  ]), []);
