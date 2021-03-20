import cheerio from 'cheerio';
import chalk from 'chalk';

import { puppeteerHandler } from '../index.js';

import { getTrimmedTextOfElement } from './cheerio.js';

import { Time } from '../constants/schedule.js';
import { IClass, IWeekSchedule } from '../interfaces';

const Selector = {
  'SCHEDULE_DAY': '.rasp-day',
  'DATE': '.vt237[data-i]',
  'SUBJECT': '.vt240',
  'TEACHER': '.vt241',
  'CLASSROOM': '.vt242',
  'CLASS_FORM': '.vt243',
};

type GroupCodeType = {
  [key: string]: string
};

export const GroupCode: GroupCodeType = {
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
    const $dateElements = $(Selector.DATE);

    $dateElements.each((i, cheerioElement) => {
      const element = $(cheerioElement);

      if (!element.is(':empty')) {
        const date = element.children().remove().end().text().trim();
        weekScheduleItem.days[i % 6].date = date;
      }
    });

    $scheduleDays.each((i, cheerioElement) => {
      const element = $(cheerioElement);

      if (!element.is(':empty')) {
        const scheduleItem: IClass = {
          subject: getTrimmedTextOfElement(element.find(Selector.SUBJECT)),
          teacher: getTrimmedTextOfElement(element.find(Selector.TEACHER)),
          type: getTrimmedTextOfElement(element.find(Selector.CLASS_FORM)),
          classroom: getTrimmedTextOfElement(element.find(Selector.CLASSROOM)),
          time: Time[Math.floor(i / 6)],
        };

        weekScheduleItem.days[i % 6].classes.push(scheduleItem);
      }
    });
  } catch (err) {
    console.log(chalk.red('Произошла ошибка!'));
    console.log(err);
  }
};
