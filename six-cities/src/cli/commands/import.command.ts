import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import chalk from 'chalk';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename?.trim());

    try{
      fileReader.read();
      console.log(fileReader.toArray());
    }catch (err){

      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(chalk.green(`Can't import data from file: ${filename}`));
      console.error(chalk.green(`Details: ${err.message}`));
    }
  }
}
