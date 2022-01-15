import Game from '~/scenes/Game'
import { Player } from './Player'

export class Cursor {
  private scene: Game
  private highlight: Phaser.GameObjects.Ellipse
  private selectedPlayer?: Player
  constructor(positions: { x: number; y: number }, scene: Game) {
    this.scene = scene
    const { x, y } = positions
    this.highlight = this.scene.add
      .ellipse(x, y, 40, 10)
      .setVisible(false)
      .setStrokeStyle(2, 0x0000ff)
  }

  highlightPlayer(player: Player) {
    const playerSprite = player.sprite
    this.highlight.setPosition(
      playerSprite.x,
      playerSprite.y + (playerSprite.height / 2) * playerSprite.scale
    )
    this.highlight.setVisible(true)
    this.highlight.setDepth(playerSprite.depth - 1)
    this.selectedPlayer = player
  }

  getSelectedPlayer() {
    return this.selectedPlayer
  }

  updateToSelectedPlayerPosition() {
    if (this.selectedPlayer) {
      const playerSprite = this.selectedPlayer.sprite
      this.highlight.x = playerSprite.x
      this.highlight.y = playerSprite.y + (playerSprite.height / 2) * playerSprite.scale
    }
  }
}
