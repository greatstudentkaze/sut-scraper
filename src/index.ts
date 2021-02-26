import cheerio from 'cheerio';
import chalk from 'chalk';

import Saver from './handlers/saver.js';

import { getPageContent } from './helpers/puppeteer.js';

import { formatDate, getTimeOfCurrentMonday, getStudyWeek } from './utils/date.js';
import { getURL } from './utils/url.js';
import { getTrimmedTextOfElement } from './utils/cheerio.js';

import { Time } from './constants/schedule.js';

const DATE = formatDate(getTimeOfCurrentMonday());
const GroupCode = {
  'IST-922': '54214',
};

const Selector = {
  'SCHEDULE_DAY': '.rasp-day',
  'SUBJECT': '.vt240',
  'TEACHER': '.vt241',
  'CLASSROOM': '.vt242',
  'CLASS_FORM': '.vt243',
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

(async () => {
  try {
    const url = getURL(GroupCode['IST-922'], DATE);
    const pageContent = await getPageContent(url);
    const studyWeek = getStudyWeek();

    const ClassSchedule: ScheduleType = [
      {
        week: studyWeek,
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
      },
    ];

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

        const weekItem = ClassSchedule.find(item => item.week === studyWeek);

        weekItem!.days[i % 6].lessons.push(scheduleItem); // maybe bad cuz may not find a week and weekTime will be undefined
      }
    });

    for (const weekSchedule of ClassSchedule) {
      await saver.saveWeekSchedule(weekSchedule);
    }

    // ClassSchedule.forEach(it => it.days.forEach(it => console.log(it)));


    /*for (const page of arrayFromLength(1)) {
      const url = `${URL}${date}`;
      const pageContent = await getPageContent(url);
      // console.log(pageContent);

      const $ = cheerio.load(pageContent);
      const scheduleItems = [];

      $('.rasp-day').each((i, header) => {
        // const url = $(header).attr('href');
        // const title = $(header).text();
        const teacher = $(header).find('.teacher').text().trim();
        const subject = $(header).find('.vt240').text().trim();
        const text = $(header).text();

        console.log(text);
        scheduleItems.push({ teacher, subject, code: slugify(subject) });
      });

      // console.log(scheduleItems);

      // await listItemsHandler(scheduleItems);

      for (const { subject, teacher, code } of scheduleItems) {
        if (!subject || !teacher || !code) {
          continue;
        }
        await saveData({ subject, teacher, code });
      }

    }*/
  } catch (err) {
    console.log(chalk.red('Произошла ошибка!'));
    console.log(err);
  }
})();

