import Game from '~/scenes/Game'
import { Fish } from './Fish'

export class Cursor {
  private scene: Game
  private selectedFish?: Fish
  constructor(positions: { x: number; y: number }, scene: Game) {
    this.scene = scene
    const { x, y } = positions
  }

  highlightFish(fish: Fish) {
    const fishSprite = fish.sprite
    this.selectedFish = fish
    this.scene.cameras.main.startFollow(this.selectedFish.sprite)
  }

  getSelectedFish() {
    return this.selectedFish
  }
}
