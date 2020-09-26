export class ConsoleOutputRow {
  public consoleOutput: string;
  public isBottomRow: boolean;
  public id: string;
  public withPrefix: boolean;

  constructor(consoleOutput: string, isBottomRow: boolean, id: string, withPrefix: boolean) {
    this.consoleOutput = consoleOutput;
    this.isBottomRow = isBottomRow;
    this.id = id;
    this.withPrefix = withPrefix;
  }
}
