import fs from 'fs';
import path from 'path';

import ScheduleModel from '../model/schedule.js';

import { Request, Response } from 'express';
import { IWeekSchedule } from '../interfaces';
import { classSchedule, puppeteerHandler, scrapeSchedule } from '../index.js';
import taskQueue from '../utils/taskQueue.js';

class ScheduleController {
  async create(req: Request, res: Response) {
    const { group } = req.body;
    let classSchedule = [];

    if (group === 'IST-922') {
      classSchedule = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data/schedule-semester.json'), 'utf-8').toString());
    }

    const schedule = await ScheduleModel.create({
      group,
      schedule: classSchedule
    });

    res.json(schedule);
  }

  async get(req: Request, res: Response) {
    const { schedule } = await ScheduleModel.findOne({ group: 'IST-922' });

    if (req.query.week) {
      const weekNumber = Number(req.query.week);

      const weekSchedule = schedule.find((it: IWeekSchedule) => it.week === weekNumber);

      return res.json(weekSchedule.days);
    }

    res.json(schedule);
  }

  async update(req: Request, res: Response) {
    try {
      const { group } = req.body;

      if (group !== 'IST-922') {
        res.status(500).json(`There is no schedule for ${group} group`);
      }

      await puppeteerHandler.initBrowser();
      console.log('\nБраузер инициализирован, начинаю парсить');
      scrapeSchedule(group);
      await taskQueue.drain();
      await ScheduleModel.updateOne({ group }, { $set: { schedule: classSchedule }});

      res.json(`The schedule for ${group} group will be updated in a few minutes.`);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default new ScheduleController();
