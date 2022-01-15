export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('field', 'soccer-field.png')
  }

  create() {
    this.scene.start('game')
  }
}
