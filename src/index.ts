import chalk from 'chalk';

import PuppeteerHandler from './handlers/puppeteer.js';
import Saver from './handlers/saver.js';

import taskQueue from './utils/taskQueue.js';
import { createWeekScheduleItem } from './utils/common.js';
import { getMondayDatesArray } from './utils/date.js';
import { getURL, getWeekScheduleData, GroupCode } from './utils/scraper.js';

import { ScheduleType } from './types';


export const puppeteerHandler = new PuppeteerHandler();

const saver = new Saver('data');

const classSchedule: ScheduleType = [];

export const onTaskQueueDrain = async () => {
  const formattedData = saver.formatScheduleForGoogleCalendar(classSchedule);

  await saver.saveSemesterSchedule(classSchedule);
  await saver.saveFormattedSchedule(formattedData);
}

const main = () => {
  getMondayDatesArray().forEach((date, index) => {
    taskQueue.push(
      async () => {
        const url = getURL(GroupCode['IST-922'], date);
        const weekScheduleItem = createWeekScheduleItem(index + 1);

        await getWeekScheduleData(url, weekScheduleItem);

        classSchedule.push(weekScheduleItem);
      },
      err => {
        if (err) {
          throw new Error(`Ошибка при получении данных со страницы ${index + 1} недели\n`);
        }

        console.log(chalk.green.bold(`Завершено получение данных со страницы ${index + 1} недели\n`));
      }
    );
  });
};

puppeteerHandler.initBrowser()
  .then(main);
