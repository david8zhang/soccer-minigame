import Game, { Side } from '~/scenes/Game'
import { Constants } from '~/utils/Constants'
import { Cursor } from './Cursor'
import { Fish } from './Fish'

export class Player {
  private game: Game
  public players: Fish[]
  private cursor: Cursor
  private selectedPlayerIndex: number = 0

  constructor(game: Game) {
    this.game = game
    this.players = this.createFieldPlayers(Constants.NUM_FIELD_PLAYERS_PER_TEAM, 'fish4')
    this.cursor = new Cursor({ x: 0, y: 0 }, this.game)
    this.cursor.selectFish(this.players[this.selectedPlayerIndex])
    this.listenKeyboardInputs()
  }

  getSelectedFish() {
    return this.cursor.getSelectedFish()
  }

  createFieldPlayers(numFieldPlayers: number, playerTexture: string): Fish[] {
    const players: Fish[] = []
    const positions = Constants.PLAYER_KICKOFF_POSITIONS
    for (let i = 0; i < numFieldPlayers; i++) {
      const zoneId = positions[i]
      if (zoneId) {
        const zone = this.game.getZoneForZoneId(zoneId)
        if (zone) {
          const { centerPosition } = zone
          const fish = new Fish(
            {
              position: { x: centerPosition.x, y: centerPosition.y },
              side: Side.PLAYER,
              texture: playerTexture,
            },
            this.game
          )
          players.push(fish)
        }
      }
    }
    return players
  }

  switchPlayer() {
    const selectedFish = this.getSelectedFish()
    if (selectedFish) {
      selectedFish.setVelocity(0, 0)
    }
    this.selectedPlayerIndex = (this.selectedPlayerIndex + 1) % this.players.length
    this.cursor.selectFish(this.players[this.selectedPlayerIndex])
  }

  passBall() {
    const fishWithBall = this.game.ball.fishWithBall
    if (fishWithBall && fishWithBall.side === Side.PLAYER) {
      const supportingFish = this.players.find((f: Fish) => f !== fishWithBall)
      if (supportingFish) {
        fishWithBall.kickBall(this.game.ball, supportingFish)
        const timeEvent = this.game.time.addEvent({
          repeat: -1,
          delay: 10,
          callback: () => {
            if (this.game.ball.fishWithBall === supportingFish) {
              this.cursor.selectFish(supportingFish)
              timeEvent.destroy()
              fishWithBall.setVelocity(0, 0)
            }
          },
        })
      }
    }
  }

  stealBall() {
    const fish = this.getSelectedFish()
    if (fish) {
      const distance = Constants.getDistanceBetweenObjects(fish, this.game.ball)
      if (distance < Constants.STEAL_DISTANCE) {
        fish.stealBall(this.game.ball)
      }
    }
  }

  update() {
    this.cursor.follow()
    this.handlePlayerMovement()
  }

  listenKeyboardInputs() {
    this.game.input.keyboard.on('keydown', (keyCode) => {
      switch (keyCode.code) {
        case 'KeyA': {
          this.game.player.passBall()
          break
        }
        case 'KeyS': {
          const selectedPlayer = this.game.getPlayerSelectedFish()
          if (selectedPlayer && selectedPlayer.hasBall(this.game.ball)) {
            selectedPlayer.kickBall(this.game.ball, this.game.enemyGoal)
          }
          break
        }
        case 'KeyD': {
          this.game.player.stealBall()
          break
        }
        case 'Space': {
          this.game.player.switchPlayer()
          break
        }
        case 'Backquote':
          this.game.debug.setVisible(!this.game.debug.isVisible)
          break
      }
    })
  }

  handlePlayerMovement() {
    const keyboard = this.game.input.keyboard.createCursorKeys()
    const leftDown = keyboard.left?.isDown
    const rightDown = keyboard.right?.isDown
    const upDown = keyboard.up?.isDown
    const downDown = keyboard.down?.isDown

    const playerFish = this.getSelectedFish()
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
}
