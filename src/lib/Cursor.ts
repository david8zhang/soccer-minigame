import Game from '~/scenes/Game'
import { Player } from './Player'

export class Cursor {
  private scene: Game
  private highlight: Phaser.GameObjects.Ellipse
  constructor(positions: { x: number; y: number }, scene: Game) {
    this.scene = scene
    const { x, y } = positions
    this.highlight = this.scene.add
      .ellipse(x, y, 30, 10)
      .setVisible(false)
      .setStrokeStyle(2, 0x0000ff)
  }

  highlightPlayer(player: Player) {
    console.log('went here!')
    this.highlight.setPosition(player.x, player.y + player.width)
    this.highlight.setVisible(true)
    this.highlight.setDepth(player.depth - 1)
    console.log(this.highlight.depth)
  }
}
