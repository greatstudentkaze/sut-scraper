import Router from 'express';

import ScheduleController from './controller/schedule.js';

const router = Router();

router.post('/schedule', ScheduleController.create);
router.get('/schedule', ScheduleController.get);
router.put('/schedule', ScheduleController.update);

export default router;
