import ScheduleService from '../service/schedule.js';

import { Request, Response } from 'express';

class ScheduleController {
  async create(req: Request, res: Response) {
    try {
      const { group } = req.params;

      const schedule = await ScheduleService.create(group);

      res.json(schedule);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { group } = req.params;

      const schedule = req.query.week
        ? await ScheduleService.getForWeek(group, Number(req.query.week))
        : await ScheduleService.get(group);

      res.json(schedule);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { group } = req.params;

      const schedule = await ScheduleService.update(group);

      res.json(schedule);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
}

export default new ScheduleController();
