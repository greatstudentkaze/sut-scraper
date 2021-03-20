import fs from 'fs';
import path from 'path';

import ScheduleModel from '../model/schedule.js';

import { classSchedule, puppeteerHandler, scrapeSchedule } from '../index.js';
import taskQueue from '../utils/taskQueue.js';

import { IWeekSchedule } from '../interfaces';

class ScheduleService {
  async create(group: string) {
    let classSchedule = [];

    if (group === 'IST-922') {
      classSchedule = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data/schedule-semester.json'), 'utf-8').toString());
    }

    const schedule = await ScheduleModel.create({ group, schedule: classSchedule });

    return schedule;
  }

  async get(group: string) {
    const { schedule } = await ScheduleModel.findOne({ group });
    return schedule;
  }

  async getForWeek(group: string, week: number) {
    const { schedule } = await ScheduleModel.findOne({ group });

    const weekSchedule = schedule.find((it: IWeekSchedule) => it.week === week);

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
    await ScheduleModel.updateOne({ group }, { $set: { schedule: classSchedule }});

    return `The schedule for ${group} group will be updated in a few minutes.`;
  }
}

export default new ScheduleService();
