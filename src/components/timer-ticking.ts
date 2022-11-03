import { TimetickerLayer } from "../common/common.js";
import { CanvasStack } from "../utility/canvas-stack.js";
import { Game } from "../scenes/game.js";
import { LevelStartScene } from "../scenes/level-start-scene.js";
export class TimerTicking {
  public game: Game;
  public width: number;
  public height: number;
  public widthToClear: number;
  public maxLimitExhausted: boolean;
  public timer: number;
  public isTimerStarted: boolean;
  public isTimerEnded: boolean;
  public levelStart: LevelStartScene;
  public isTimerRunningOut: boolean;
  public canavsElement: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public timer_full: HTMLImageElement;
  public pauseButtonClicked: boolean;
  public canvasStack: {
    createLayer: (arg0: number, arg1: number, arg2: string) => any;
    deleteLayer: (arg0: any) => void;
  };
  public id: string;

  constructor(game: Game, levelStart: LevelStartScene) {
    this.game = game;
    this.width = game.width;
    this.height = game.height;
    this.widthToClear = this.game.width / 3.4;
    this.maxLimitExhausted = false;
    this.canvasStack = new CanvasStack("canvas");
    this.timer = 0;
    this.isTimerStarted = false;
    this.isTimerEnded = false;
    this.levelStart = levelStart;
    this.isTimerRunningOut = false;
    var self = this;
    this.createCanvas();
  }
  createCanvas() {
    this.id = this.canvasStack.createLayer(
      this.height,
      this.width,
      TimetickerLayer
    );
    this.canavsElement = document.getElementById(this.id) as HTMLCanvasElement;
    this.context = this.canavsElement.getContext("2d");
    this.canavsElement.style.zIndex = "4";
    // this.animation(0);
  }
  deleteCanvas() {
    this.canvasStack.deleteLayer(this.id);
  }
  draw() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.drawImage(
      this.timer_full,
      this.game.width * 0.12,
      this.height * 0.099,
      this.game.width - 50,
      this.height * 0.05
    );
    this.beginTimerOnStart();
  }
  createBackgroud() {
    var self = this;
    this.timer_full = new Image();
    this.timer_full.src = "./assets/images/timer_full.png";
    this.timer_full.onload = function (e) {
      self.draw();
      self.beginTimerOnStart();
    };
  }
  update() {
    if (this.isTimerStarted) {
      this.timer += 0.06;
      if (this.game.width * 1.3 - this.widthToClear - 10 * this.timer > 55) {
        this.context.clearRect(
          this.game.width * 1.3 - this.widthToClear - 10 * this.timer,
          0,
          this.width,
          this.height
        );
      }
      if (
        this.game.width * 1.3 - this.widthToClear - 10 * this.timer < 100 &&
        this.game.width * 1.3 - this.widthToClear - 10 * this.timer > 54 &&
        !this.isTimerRunningOut
      ) {
        this.isTimerRunningOut = true;
        this.levelStart.audio.changeSourse("./assets/audios/timeout.mp3");
      }
      if (
        this.game.width * 1.3 - this.widthToClear - 10 * this.timer < 55 &&
        this.game.width * 1.3 - this.widthToClear - 10 * this.timer > 54
      ) {
        this.isTimerRunningOut = false;
        this.isTimerEnded = true;
        this.isTimerEnded ? this.levelStart.changePuzzle() : null;
        this.timer = 0;
      }
    }
  }
  beginTimerOnStart() {
    var self = this;
    setTimeout(() => {
      if (!this.pauseButtonClicked) {
        if (!self.isTimerStarted && self.timer == 0) {
          self.timer = 0;
          self.isTimerStarted = true;
        }
      }
    }, 6000);
  }
  stopTimer() {
    this.isTimerStarted = false;
    setTimeout(() => {
      this.timer = 0;
    }, 3000);
    this.timer = 0;
  }
  pauseTimer() {
    this.isTimerStarted = false;
    this.pauseButtonClicked = true;
  }
  resumeTimer() {
    this.isTimerStarted = true;
    this.pauseButtonClicked = false;
  }
}
