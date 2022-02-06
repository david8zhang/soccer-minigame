import { Scene } from 'phaser'
import { Constants } from '~/utils/Constants'

export class Start extends Scene {
  constructor() {
    super('start')
  }

  create(): void {
    const gameWidth = this.cameras.main.width
    const gameHeight = this.cameras.main.height

    const text = this.add.text(0, 0, 'Sakana Soccer').setDepth(200)
    text.setStyle({
      fontSize: 75,
    })
    text.setPosition(gameWidth / 2 - text.width / 2, 200)
    const bg = this.add.image(gameWidth / 2, gameHeight / 2, 'start-screen')
    const scaleX = gameWidth / bg.width
    const scaleY = gameHeight / bg.height
    bg.setScale(scaleX, scaleY)

    const playButton = this.add.image(0, 0, 'play-button').setScale(0.5).setInteractive()
    playButton.on('pointerover', () => {
      playButton.setTint(0xf0ff00)
      document.body.style.cursor = 'pointer'
    })
    playButton.on('pointerout', () => {
      playButton.setTint(0xffffff)
      document.body.style.cursor = 'default'
    })
    playButton.on('pointerdown', () => {
      this.scene.start('game')
      document.body.style.cursor = 'default'
    })
    playButton.setPosition(gameWidth / 2, gameHeight / 2 + 50)
  }
}
