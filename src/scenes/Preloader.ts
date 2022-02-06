export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    // Fish
    this.load.image('fish1', 'fish/fish1.png')
    this.load.image('fish2', 'fish/fish2.png')
    this.load.image('fish3', 'fish/fish3.png')
    this.load.image('fish4', 'fish/fish4.png')

    // Ball, field
    this.load.image('bg', 'bg.jpeg')
    this.load.image('ball', 'ball.png')
    this.load.image('goal', 'bubble-goal.png')

    // Splash animations
    this.load.atlas('splash', 'splash/splash.png', 'splash/splash.json')

    this.load.image('start-screen', 'start-screen.png')
    this.load.image('play-button', 'play-button.png')
  }

  create() {
    this.scene.start('start')
  }
}
