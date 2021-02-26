import { queue } from 'async';
import chalk from 'chalk';

import { puppeteerHandler } from '../index.js';

const CONCURRENCY = 10;
const startTime = Date.now();

const taskQueue = queue(async (task: () => void, done) => {
  try {
    await task();
    console.log(chalk.bold.magenta(`Один из тасков выполнен, осталось: ${taskQueue.length()}`));
    done();
  } catch (err) {
    throw err;
  }
}, CONCURRENCY);

taskQueue.drain(async () => {
  const endTime = Date.now();
  console.log(chalk.green.bold(`Все таски выполнены! [${(endTime - startTime) / 1000}s]`));
  await puppeteerHandler.closeBrowser()
  process.exit();
});

export default taskQueue;
