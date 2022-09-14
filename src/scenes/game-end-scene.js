import { CanvasStack } from "../utility/canvas-stack.js";
import {
    GameEndLayer,
  loadImages
} from "../common/common.js";

var images = {
    bgImg: "./assets/images/bg_v01.jpg",
    hillImg: "./assets/images/hill_v01.png",
    timer_empty: "./assets/images/timer_empty.png",
    pillerImg: "./assets/images/Totem_v02_v01.png",
    grassImg: "./assets/images/FG_a_v01.png",
    fenchImg: "./assets/images/fence_v01.png",
    bigMonsterImg: "./assets/images/ftm_bonus_level_monsters.png"
};

export class GameEndScene {
    constructor(game) {
      this.game = game;
      this.width = game.width;
      this.height = game.height;
      self = this;
      this.canvasStack = new CanvasStack("canvas");
      this.createCanvas();
    }
  
    createCanvas() {
      this.id = this.canvasStack.createLayer(
        this.height,
        this.width,
        GameEndLayer
      );
      this.canavsElement = document.getElementById(this.id);
      this.context = this.canavsElement.getContext("2d");
      this.canavsElement.style.zIndex = 3;
      document.getElementById("discription-text").style.display = "block";
      this.createBackgroud()
    }
  
    deleteCanvas() {
        document.getElementById("discription-text").style.display = "none";
      this.canvasStack.deleteLayer(this.id);
      delete this;
    }

    draw() {
     
    }
  
    createBackgroud() {
      var self = this;
      var context = this.context;
      var width = this.width;
      var height = this.height;
      console.log("iuiiuiu")
      loadImages(images, function (image) {
        context.drawImage(image.bgImg, 0, 0, width, height);
        context.drawImage(
          image.pillerImg,
          width * 0.6,
          height / 6,
          width,
          height / 2
        );
        context.drawImage(
          image.fenchImg,
          -width * 0.4,
          height / 3,
          width,
          height / 3
        );
        context.drawImage(
          image.hillImg,
          -width * 0.25,
          height / 2,
          width * 1.5,
          height / 2
        );
        context.drawImage(
          image.grassImg,
          -width * 0.25,
          height / 2 + (height / 2) * 0.1,
          width * 1.5,
          height / 2
        );

        context.drawImage(
            image.bigMonsterImg,
            width * 0.25,
            height / 2 - height * 0.25,
            width / 1.7,
            height / 2.5
        )
      });
    }
}