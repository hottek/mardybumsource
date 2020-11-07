import {Component, Renderer2, OnInit, OnDestroy} from '@angular/core';
import {ConsoleOutputRow} from './console-output-row';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2 ) {
    this.appCodeName = navigator.platform;
  }
  public title = 'hottek';
  public appCodeName: string;
  public globalListenFunc: any;
  public consoleOutput: ConsoleOutputRow[] = [];
  public currentRow = 'console-input';

  private static isLatinKey(keyCode: number) { // keyCode is deprecated, might not work in some browsers
    return keyCode >= 65 && keyCode <= 90;
  }

  private static isBackspaceKey(key: string) {
    return key === 'Backspace';
  }

  private static isEnterKey(key: any) {
    return key === 'Enter';
  }

  ngOnInit() {
    this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      this.processKeyDown(e);
    });
  }

  ngOnDestroy() {
    this.globalListenFunc();
  }

  private processKeyDown(e: KeyboardEvent) {
    const span = document.getElementById(this.currentRow);
    if (AppComponent.isLatinKey(e.keyCode)) {
      const key = document.createTextNode(e.key);
      span.appendChild(key);
    } else if (AppComponent.isBackspaceKey(e.key)) {
      e.preventDefault();
      span.lastChild.remove();
    } else if (AppComponent.isEnterKey(e.key)) {
      this.processConsoleInput(span.innerText);
    }
  }

  private processConsoleInput(input: string) {
    const id = 'console-output' + this.consoleOutput.length; // TODO: generate id as uuid
    this.currentRow = id;
    this.updateBottomRow();
    switch (input) {
      case 'help':
        this.consoleOutput.push(new ConsoleOutputRow('try these commands: about, whoami, clear', false, '', false));
        this.consoleOutput.push(new ConsoleOutputRow('', true, id, true));
        break;
      case 'about':
        this.consoleOutput.push(new ConsoleOutputRow('Hey, my name is Lukas. I study applied computer science at SAP. Follow me on Github!',
                                          false, '', false));
        this.consoleOutput.push(new ConsoleOutputRow('', true, id, true));
        break;
      case 'clear':
        this.consoleOutput = [];
        this.currentRow = 'console-input';
        const span = document.getElementById(this.currentRow);
        span.innerText = '';
        break;
      case 'whoami':
        this.consoleOutput.push(new ConsoleOutputRow('I don\'t know, you tell me.', false, '', false));
        this.consoleOutput.push(new ConsoleOutputRow('', true, id, true));
        break;
      default:
        this.consoleOutput.push(new ConsoleOutputRow('', true, id, true));
    }
  }

  private updateBottomRow() {
    this.consoleOutput.forEach(row => {
      row.isBottomRow = false;
    });
  }
}
