import express from 'express';
import mongoose from 'mongoose';
import apicache from 'apicache';
import chalk from 'chalk';
import 'dotenv/config.js';

import Saver from './handlers/saver.js';
import router from './router.js';

const DB_URL = process.env.DATABASE_URL;

const saver = new Saver('data');

/*export const onTaskQueueDrain = async () => {
  const formattedData = saver.formatScheduleForGoogleCalendar(classSchedule);

  await saver.saveSemesterSchedule(classSchedule);
  await saver.saveFormattedSchedule(formattedData);
}*/

const app = express();
app.use(apicache.middleware('5 minutes'));
app.use(express.json());
app.use('/', router);

const startApp = async () => {
  try {
    if (!DB_URL) {
      throw new Error('Добавь ссылку для подключения к MongoDB Cluster: https://cloud.mongodb.com/v2/6052e4597f4d234d9e630ce2#clusters/connect?clusterId=Cluster0');
    }

    await mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
    app.listen(process.env.PORT,() => console.log(chalk.green(`Server started on port ${process.env.PORT}...`)));
  } catch (err) {
    console.log(chalk.red(err));
  }
};

startApp();
