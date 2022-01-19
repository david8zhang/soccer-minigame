import Game from '~/scenes/Game'
import { Constants } from '~/utils/Constants'
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

  getPlayerSelectedFish() {
    return this.cursor.getSelectedFish()
  }

  initializeActionListener() {
    this.scene.input.keyboard.on('keydown', (keyCode) => {
      switch (keyCode.code) {
        case 'Space': {
          const selectedPlayer = this.cursor.getSelectedFish()
          if (selectedPlayer && selectedPlayer.hasBall(this.scene.ball)) {
            selectedPlayer.shoot(this.scene.ball, this.scene.enemyGoal)
          }
          break
        }
        case 'KeyE': {
          const selectedPlayer = this.cursor.getSelectedFish()
          if (selectedPlayer) {
            const distance = Constants.getDistanceBetweenObjects(selectedPlayer, this.scene.ball)
            if (distance < Constants.STEAL_DISTANCE) {
              selectedPlayer.stealBall(this.scene.ball)
            }
          }
          break
        }
      }
    })
  }

  handlePlayerMovement() {
    const keyboard = this.scene.input.keyboard.createCursorKeys()
    const leftDown = keyboard.left?.isDown
    const rightDown = keyboard.right?.isDown
    const upDown = keyboard.up?.isDown
    const downDown = keyboard.down?.isDown

    const playerFish = this.getPlayerSelectedFish()
    if (!playerFish) {
      return
    }
    if (!leftDown && !rightDown && !upDown && !downDown) {
      playerFish.setVelocity(0, 0)
      return
    }
    const speed = Constants.FISH_SPEED
    if (leftDown || rightDown) {
      let velocityX = leftDown ? -speed : speed
      playerFish.setFlipX(leftDown)
      if (leftDown && rightDown) {
        velocityX = 0
      }
      playerFish.setVelocityX(velocityX)
    } else {
      playerFish.setVelocityX(0)
    }
    if (upDown || downDown) {
      let velocityY = upDown ? -speed : speed
      if (upDown && downDown) {
        velocityY = 0
      }
      playerFish.setVelocityY(velocityY)
    } else {
      playerFish.setVelocityY(0)
    }
  }

  update() {
    this.handlePlayerMovement()
  }
}
