import { Scene } from 'phaser'
import { Constants } from '~/utils/Constants'

export class GameOver extends Scene {
  public score!: {
    player: number
    cpu: number
  }

  constructor() {
    super('gameover')
  }

  init(data: any): void {
    this.score = data.score
    this.input.keyboard.on('keydown', (key) => {
      if (key.code === 'Space') {
        this.scene.start('game')
      }
    })
  }

  create(): void {
    let text = ''
    if (this.score.player > this.score.cpu) {
      text = 'You Won!'
    } else if (this.score.player < this.score.cpu) {
      text = 'You Lost...'
    } else {
      text = 'You Tied!'
    }

    const endText = this.add.text(0, 0, text)
    endText.setStyle({
      fontSize: 150,
    })
    endText.setPosition(Constants.BG_WIDTH / 2 - endText.width / 2, 200)
    const finalScore = this.add.text(0, 0, `${this.score.player} - ${this.score.cpu}`)
    finalScore.setStyle({
      fontSize: 75,
    })
    finalScore.setPosition(Constants.BG_WIDTH / 2 - finalScore.width / 2, 400)
    const playAgainText = this.add.text(0, 0, 'Press space to play again')
    playAgainText.setStyle({
      fontSize: 60,
    })
    playAgainText.setPosition(Constants.BG_WIDTH / 2 - playAgainText.width / 2, 600)
  }
}
