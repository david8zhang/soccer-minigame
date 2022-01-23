import Game from '~/scenes/Game'
import { Fish } from './Fish'

export class Cursor {
  private scene: Game
  private selectedFish?: Fish
  public highlight: Phaser.GameObjects.Ellipse

  constructor(positions: { x: number; y: number }, scene: Game) {
    this.scene = scene
    const { x, y } = positions
    this.highlight = this.scene.add
      .ellipse(x, y, 20, 20, 0x00ff00, 0)
      .setStrokeStyle(4, 0x00ff00)
      .setOrigin(0)
  }

  highlightFish(fish: Fish) {
    const fishSprite = fish.sprite
    this.highlight.setSize(fishSprite.body.width, 30)
    this.highlight.setVisible(true)
    this.highlight.setPosition(fishSprite.x - fishSprite.displayWidth / 2, fishSprite.y + 10)
  }

  selectFish(fish: Fish) {
    this.selectedFish = fish
    this.highlightFish(fish)
  }

  getSelectedFish() {
    return this.selectedFish
  }

  follow() {
    if (this.selectedFish) {
      const fishSprite = this.selectedFish.sprite
      this.highlight.setPosition(fishSprite.x - fishSprite.displayWidth / 2, fishSprite.y + 10)
    }
  }
}
