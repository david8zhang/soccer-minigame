export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('bg', 'bg.jpeg')

    // Fish
    this.load.image('fish1', 'fish/fish1.png')
    this.load.image('fish2', 'fish/fish2.png')
    this.load.image('fish3', 'fish/fish3.png')
    this.load.image('fish4', 'fish/fish4.png')

    // Ball
    this.load.image('ball', 'ball.png')
  }

  create() {
    this.scene.start('game')
  }
}
