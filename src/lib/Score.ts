import Game from '~/scenes/Game'
import { Constants } from '~/utils/Constants'

export class Score {
  private game: Game
  public text: Phaser.GameObjects.Text

  public playerScore: number = 0
  public cpuScore: number = 0

  constructor(game: Game) {
    this.game = game
    this.text = this.game.add
      .text(0, 0, `${this.playerScore} - ${this.cpuScore}`)
      .setStyle({
        fontSize: 75,
      })
      .setOrigin(0)
    this.text.setPosition(Constants.BG_WIDTH / 2 - this.text.width / 2, 50)
  }

  incrementPlayerScore() {
    this.playerScore++
    this.updateScore()
  }

  incrementCPUScore() {
    this.cpuScore++
    this.updateScore()
  }

  updateScore() {
    this.text.setText(`${this.playerScore} - ${this.cpuScore}`)
    this.text.setPosition(Constants.BG_WIDTH / 2 - this.text.width / 2, 50)
  }
}
