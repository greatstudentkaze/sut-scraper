import Router from 'express';

import ScheduleController from './controller/schedule.js';

const router = Router();

router.post('/schedules/:group', ScheduleController.create);
router.get('/schedules/:group', ScheduleController.get);
router.put('/schedules/:group', ScheduleController.update);

export default router;
