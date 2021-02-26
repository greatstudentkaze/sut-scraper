import cheerio from 'cheerio';
import chalk from 'chalk';

import { puppeteerHandler } from '../index';

import { getTrimmedTextOfElement } from './cheerio';

import { Time } from '../constants/schedule';
import { IScheduleItem, IWeekSchedule } from '../interfaces';

const Selector = {
  'SCHEDULE_DAY': '.rasp-day',
  'SUBJECT': '.vt240',
  'TEACHER': '.vt241',
  'CLASSROOM': '.vt242',
  'CLASS_FORM': '.vt243',
};

export const GroupCode = {
  'IST-922': '54214',
};

export const getURL = (groupCode: string, date: string): string => {
  const BASE_URL = 'https://www.sut.ru/studentu/raspisanie/raspisanie-zanyatiy-studentov-ochnoy-i-vecherney-form-obucheniya';

  return `${BASE_URL}?group=${groupCode}&date=${date}`;
};

export const getWeekScheduleData = async (url: string, weekScheduleItem: IWeekSchedule) => {
  try {
    const pageContent = await puppeteerHandler.getPageContent(url);

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
