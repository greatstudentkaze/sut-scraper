import cheerio from 'cheerio';
import chalk from 'chalk';

import Saver from './handlers/saver.js';

import { getPageContent } from './utils/puppeteer.js';

import { getMondayDatesArray } from './utils/date.js';
import { getURL } from './utils/url.js';
import { getTrimmedTextOfElement } from './utils/cheerio.js';
import { Selector } from './utils/scraper.js';

import { Time } from './constants/schedule.js';

const GroupCode = {
  'IST-922': '54214',
};

interface IScheduleItem {
  subject: string,
  teacher: string,
  type: string,
  classroom: string,
  time: {
    start: string,
    end: string,
  },
}

type DayOfTheWeekType = 'Понедельник' | 'Вторник' | 'Среда' | 'Четверг' | 'Пятница' | 'Суббота';

interface IDaySchedule {
  day: DayOfTheWeekType,
  lessons: IScheduleItem[],
}

export interface IWeekSchedule {
  week: number,
  days: IDaySchedule[],
}

type ScheduleType = IWeekSchedule[];

const saver = new Saver('data');

const createWeekScheduleItem = (week: number): IWeekSchedule => ({
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

const getWeekScheduleData = async (url: string, weekScheduleItem: IWeekSchedule) => {
  try {
    const pageContent = await getPageContent(url);

    const $ = cheerio.load(pageContent);
    const $scheduleDays = $(Selector.SCHEDULE_DAY);

    $scheduleDays.each((i, cheerioElement) => {
      const element = $(cheerioElement);

      if (!element.is(':empty')) {
        const scheduleItem: IScheduleItem = {
          subject: getTrimmedTextOfElement(element.find(Selector.SUBJECT)),
          teacher: getTrimmedTextOfElement(element.find(Selector.TEACHER)),
          type: getTrimmedTextOfElement(element.find(Selector.CLASS_FORM)),
          classroom: getTrimmedTextOfElement(element.find(Selector.CLASSROOM)),
          time: Time[Math.floor(i / 6)],
        };

        weekScheduleItem.days[i % 6].lessons.push(scheduleItem);
      }
    });
  } catch (err) {
    console.log(chalk.red('Произошла ошибка!'));
    console.log(err);
  }
};

(async () => {
  let i = 0;
  const ClassSchedule: ScheduleType = [];

  for (const date of getMondayDatesArray()) {
    i++;

    const url = getURL(GroupCode['IST-922'], date);
    const weekScheduleItem = createWeekScheduleItem(i);

    await getWeekScheduleData(url, weekScheduleItem);

    ClassSchedule.push(weekScheduleItem);

    await saver.saveWeekSchedule(weekScheduleItem);
  }

  // ClassSchedule.forEach(it => it.days.forEach(it => console.log(it)));
})();

