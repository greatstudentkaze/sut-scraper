import chalk from 'chalk';

import PuppeteerHandler from './handlers/puppeteer.js';
import Saver from './handlers/saver.js';

import taskQueue from './utils/taskQueue.js';
import { createWeekScheduleItem } from './utils/common';
import { getMondayDatesArray } from './utils/date.js';
import { getURL, getWeekScheduleData, GroupCode } from './utils/scraper.js';

import { ScheduleType } from './types';


export const puppeteerHandler = new PuppeteerHandler();

const saver = new Saver('data');

const main = () => {
  const ClassSchedule: ScheduleType = [];

  getMondayDatesArray().forEach((date, index) => {
    taskQueue.push(
      async () => {
        const url = getURL(GroupCode['IST-922'], date);
        const weekScheduleItem = createWeekScheduleItem(index);

        await getWeekScheduleData(url, weekScheduleItem);

        ClassSchedule.push(weekScheduleItem);

        await saver.saveWeekSchedule(weekScheduleItem);
      },
      err => {
        if (err) {
          throw new Error(`Ошибка при получении данных со страницы ${index} недели\n`);
        }

        console.log(chalk.green.bold(`Завершено получение данных со страницы ${index} недели\n`));
      }
    );
  });
};

puppeteerHandler.initBrowser()
  .then(main);
