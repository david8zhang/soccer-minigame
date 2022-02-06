import Game from '~/scenes/Game'
import { Constants } from '~/utils/Constants'

export class OnScoredText {
  private game: Game
  public text: Phaser.GameObjects.Text

  constructor(game: Game) {
    this.game = game
    this.text = this.game.add.text(0, 0, 'GOAL!').setVisible(false).setDepth(1000)
    this.text.setStyle({
      fontSize: 200,
    })
    this.text.setPosition(
      Constants.BG_WIDTH / 2 - this.text.width / 2,
      Constants.BG_HEIGHT / 2 - this.text.height / 2
    )
  }

  setVisible(isVisible: boolean) {
    this.text.setVisible(isVisible)
  }
}
