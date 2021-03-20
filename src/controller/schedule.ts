import ScheduleService from '../service/schedule.js';

import { Request, Response } from 'express';

class ScheduleController {
  async create(req: Request, res: Response) {
    try {
      const { group } = req.body;

      const schedule = await ScheduleService.create(group);
      res.json(schedule);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async get(req: Request, res: Response) {
    try {
      const schedule = req.query.week
        ? await ScheduleService.getForWeek('IST-922', Number(req.query.week))
        : await ScheduleService.get('IST-922');

      res.json(schedule);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { group } = req.body;

      await ScheduleService.update(group);

      res.json(`The schedule for ${group} group will be updated in a few minutes.`);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
}

export default new ScheduleController();
