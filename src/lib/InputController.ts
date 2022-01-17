import Game from '~/scenes/Game'
import { Cursor } from './Cursor'

export class InputController {
  private scene: Game
  private cursor: Cursor

  constructor(scene: Game) {
    this.scene = scene
    this.cursor = new Cursor({ x: 0, y: 0 }, this.scene)
    this.cursor.highlightFish(this.scene.playerTeam[0])
    this.initializeActionListener()
  }

  initializeActionListener() {
    this.scene.input.keyboard.on('keydown', (keyCode) => {
      switch (keyCode.code) {
        case 'Space': {
          const selectedPlayer = this.cursor.getSelectedFish()
          if (selectedPlayer) {
            selectedPlayer.shoot()
          }
          break
        }
      }
    })
  }

  listenPlayerMovement() {
    const keyboard = this.scene.input.keyboard.createCursorKeys()
    const selectedPlayer = this.cursor.getSelectedFish()
    if (selectedPlayer) {
      selectedPlayer.move(keyboard)
    }
  }

  update() {
    this.listenPlayerMovement()
  }
}
