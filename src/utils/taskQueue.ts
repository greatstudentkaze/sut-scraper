import { queue } from 'async';
import chalk from 'chalk';

const CONCURRENCY = 10;

const taskQueue = queue(async (task: () => void, done) => {
  try {
    await task();
    console.log(chalk.bold.magenta(`Один из тасков выполнен, осталось: ${taskQueue.length()}`));
    done();
  } catch (err) {
    throw err;
  }
}, CONCURRENCY);

export default taskQueue;
