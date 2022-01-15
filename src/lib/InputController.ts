import Game from '~/scenes/Game'
import { Cursor } from './Cursor'

export class InputController {
  private scene: Game
  private cursor: Cursor

  constructor(scene: Game) {
    this.scene = scene
    this.cursor = new Cursor({ x: 0, y: 0 }, this.scene)
    this.cursor.highlightPlayer(this.scene.playerTeam[0])
  }
}
