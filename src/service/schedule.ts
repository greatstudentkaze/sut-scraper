import ScheduleModel from '../model/schedule.js';

import { classSchedule, puppeteerHandler, scrapeSchedule } from '../index.js';
import taskQueue from '../utils/taskQueue.js';

import { IWeekSchedule } from '../interfaces';

class ScheduleService {
  async create(group: string) {
    if (group !== 'IST-922') {
      throw new Error(`We are unable to provide a schedule for ${group} group yet.`);
    }

    let scheduleDoc = await ScheduleModel.findOne({ group });

    if (!scheduleDoc) {
      await puppeteerHandler.initBrowser();
      console.log('\nБраузер инициализирован, начинаю парсить');
      scrapeSchedule(group);
      await taskQueue.drain();
      scheduleDoc = await ScheduleModel.create({ group, schedule: classSchedule });
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

    await puppeteerHandler.initBrowser();
    console.log('\nБраузер инициализирован, начинаю парсить');
    scrapeSchedule(group);
    await taskQueue.drain();
    const { schedule } = await ScheduleModel.findOneAndUpdate({ group }, { $set: { schedule: classSchedule }});

    return schedule;
  }
}

export default new ScheduleService();
