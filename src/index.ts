import express from 'express';
import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';

import PuppeteerHandler from './handlers/puppeteer.js';
import Saver from './handlers/saver.js';
import router from './router.js';

import taskQueue from './utils/taskQueue.js';
import { createWeekScheduleItem } from './utils/common.js';
import { getMondayDatesArray } from './utils/date.js';
import { getURL, getWeekScheduleData, GroupCode } from './utils/scraper.js';

import { ScheduleType } from './types';

dotenv.config();

const PORT = 9000;
const DB_URL = process.env.DATABASE_URL;

export const puppeteerHandler = new PuppeteerHandler();

const saver = new Saver('data');

export const classSchedule: ScheduleType = [];

export const onTaskQueueDrain = async () => {
  const formattedData = saver.formatScheduleForGoogleCalendar(classSchedule);

  await saver.saveSemesterSchedule(classSchedule);
  await saver.saveFormattedSchedule(formattedData);
}

export const scrapeSchedule = (group: string) => {
  getMondayDatesArray().forEach((date, index) => {
    taskQueue.push(
      async () => {
        const url = getURL(GroupCode[group], date);
        const weekScheduleItem = createWeekScheduleItem(index + 1);

        await getWeekScheduleData(url, weekScheduleItem);

        classSchedule.push(weekScheduleItem);
      },
      (err) => {
        if (err) {
          throw new Error(`Ошибка при получении данных со страницы ${index + 1} недели\n`);
        }

        console.log(chalk.green.bold(`Завершено получение данных со страницы ${index + 1} недели\n`));
      }
    );
  });
};

const app = express();

app.use(express.json());
app.use('/', router);

const startApp = async () => {
  try {
    if (!DB_URL) {
      throw new Error('Добавь ссылку для подключения к MongoDB Cluster: https://cloud.mongodb.com/v2/6052e4597f4d234d9e630ce2#clusters/connect?clusterId=Cluster0');
    }

    await mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
    app.listen(PORT,() => console.log(chalk.green(`Server started on port ${PORT}...`)));
  } catch (err) {
    console.log(chalk.red(err));
  }
};

startApp();
