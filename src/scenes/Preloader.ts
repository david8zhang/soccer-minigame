export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('field', 'soccer-field.png')
    this.load.image('player', 'player.png')
    this.load.image('ball', 'ball.png')
  }

  create() {
    this.scene.start('game')
  }
}
