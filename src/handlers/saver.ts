import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

import { IWeekSchedule } from '../interfaces';

class Saver {
  private readonly dirname: string;
  private readonly saveDir: string;
  private readonly saveDirPath: string;

  constructor(saveDir: string) {
    this.dirname = path.resolve();
    this.saveDir = saveDir;
    this.saveDirPath = path.join(this.dirname, this.saveDir)
  }

  public async saveWeekSchedule(data: IWeekSchedule) {
    const { week, days } = data;

    const fileName = `schedule-week${week}.json`;
    const savePath = path.join(this.saveDirPath, fileName);

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

  public clearSaveDirectory() {
    fs.readdir(this.saveDir, (err, files) => {
      if (err) {
        throw err;
      }

      files.forEach(file => fs.unlink(path.join(this.saveDirPath, file), err => {
        if (err) {
          throw err;
        }
      }));

      console.log(chalk.green('Директория данных очищена: ' + chalk.green.bold(this.saveDir)));
    });
  }

  private static successfulSave(fileName: string) {
    console.log(chalk.green('Файл был успешно сохранен: ' + chalk.green.bold(fileName)));
  }
}

export default Saver;
