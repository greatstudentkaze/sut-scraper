import chalk from 'chalk';

import ScheduleModel from '../model/schedule.js';
import PuppeteerHandler from '../handlers/puppeteer.js';

import taskQueue from '../utils/taskQueue.js';
import { getMondayDatesArray } from '../utils/date.js';
import { getURL, getWeekScheduleData, GroupCode } from '../utils/scraper.js';
import { createWeekScheduleItem } from '../utils/common.js';

import { IWeekSchedule } from '../interfaces';
import { ScheduleType } from '../types';

class ScheduleService {
  private classSchedule: ScheduleType;
  private readonly puppeteerHandler: PuppeteerHandler;

  constructor() {
    this.classSchedule = [];
    this.puppeteerHandler = new PuppeteerHandler();
  }

  async scrape(group: string) {
    this.classSchedule = [];
    const startTime = Date.now();
    await this.puppeteerHandler.initBrowser();
    console.log(chalk.green.bold('\nБраузер инициализирован, начинаю парсить'));

    //

    getMondayDatesArray().forEach((date, index) => {
      taskQueue.push(
        async () => {
          const url = getURL(GroupCode[group], date);
          const weekScheduleItem = createWeekScheduleItem(index + 1);

          await getWeekScheduleData(this.puppeteerHandler, url, weekScheduleItem);

          this.classSchedule.push(weekScheduleItem);
        },
        (err) => {
          if (err) {
            throw new Error(`Ошибка при получении данных со страницы ${index + 1} недели\n`);
          }

          console.log(chalk.green.bold(`Завершено получение данных со страницы ${index + 1} недели\n`));
        }
      );
    });

    //

    await taskQueue.drain();
    await this.puppeteerHandler.closeBrowser();
    const endTime = Date.now();
    console.log(chalk.green.bold(`Все таски выполнены! [${(endTime - startTime) / 1000}s]`));
  }

  async create(group: string) {
    if (group !== 'IST-922') {
      throw new Error(`We are unable to provide a schedule for ${group} group yet.`);
    }

    let scheduleDoc = await ScheduleModel.findOne({ group });

    if (!scheduleDoc) {
      await this.scrape(group);
      scheduleDoc = await ScheduleModel.create({ group, schedule: this.classSchedule });
    }

    return scheduleDoc.schedule;
  }

  async get(group: string) {
    const scheduleDoc = await ScheduleModel.findOne({ group });

    if (!scheduleDoc) {
      throw new Error(`There is no schedule for ${group} group`);
    }

    return scheduleDoc.schedule;
  }

  async getForWeek(group: string, week: number) {
    const schedule = await this.get(group);

    const weekSchedule = schedule.find((it: IWeekSchedule) => it.week === week);

    if (!weekSchedule) {
      throw new Error(`There is no schedule for week ${week}`);
    }

    return weekSchedule.days;
  }

  async update(group: string) {
    if (group !== 'IST-922') {
      throw new Error(`There is no schedule for ${group} group`);
    }

    await this.scrape(group);
    await ScheduleModel.updateOne({ group }, { $set: { schedule: this.classSchedule }});
    const { schedule } = await ScheduleModel.findOne({ group });

    return schedule;
  }
}

export default new ScheduleService();
