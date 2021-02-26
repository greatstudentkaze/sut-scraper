import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

import { IWeekSchedule } from '../index.js';

class Saver {
  private readonly dirname: string;
  private readonly saveDir: string;

  constructor(saveDir: string) {
    this.dirname = path.resolve();
    this.saveDir = saveDir;
  }

  public async saveWeekSchedule(data: IWeekSchedule) {
    const { week, days } = data;

    const fileName = `schedule-week${week}.json`;
    const savePath = path.join(this.dirname, this.saveDir, fileName);

    return new Promise(((resolve, reject) => {
      fs.writeFile(savePath, JSON.stringify(days), err => {
        if (err) {
          return reject(err);
        }

        Saver.successfulSave(fileName);
        resolve(true);
      })
    }));
  }

  private static successfulSave(fileName: string) {
    console.log(chalk.green('Файл был успешно сохранен: ' + chalk.green.bold(fileName)));
  }
}

export default Saver;
