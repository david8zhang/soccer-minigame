import Game from '~/scenes/Game'
import { Cursor } from './Cursor'

export class InputController {
  private scene: Game
  private cursor: Cursor

  constructor(scene: Game) {
    this.scene = scene
    this.cursor = new Cursor({ x: 0, y: 0 }, this.scene)
    this.cursor.highlightPlayer(this.scene.playerTeam[0])
    this.initializeActionListener()
  }

  updateCursorPosition() {
    this.cursor.updateToSelectedPlayerPosition()
  }

  initializeActionListener() {
    this.scene.input.keyboard.on('keydown', (keyCode) => {
      switch (keyCode.code) {
        case 'Space': {
          const selectedPlayer = this.cursor.getSelectedPlayer()
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
    const selectedPlayer = this.cursor.getSelectedPlayer()
    if (selectedPlayer) {
      selectedPlayer.move(keyboard)
    }
  }

  update() {
    this.listenPlayerMovement()
    this.updateCursorPosition()
  }
}
