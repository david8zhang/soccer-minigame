import Game, { Side } from '~/scenes/Game'
import { BestSpotUtil } from '~/utils/BestSpotUtil'
import { Constants } from '~/utils/Constants'
import { Cursor } from './Cursor'
import { Fish } from './Fish'
import { PlayerStates, TeamStates } from './states/StateTypes'
import { Team } from './Team'

export class Player extends Team {
  private cursor: Cursor
  private selectedPlayerIndex: number = 0
  public side: Side = Side.PLAYER
  public didDrawPositions?: boolean = false
  public bestPositions: { x: number; y: number; radius?: number }[] = []

  constructor(game: Game) {
    super(game)
    this.fieldPlayers = this.createFieldPlayers(
      Constants.NUM_FIELD_PLAYERS_PER_TEAM,
      'fish4',
      this.side,
      Constants.PLAYER_DEFENSE_KICKOFF_POSITIONS,
      Constants.FISH_SPEED
    )
    this.goalKeeper = this.createGoalKeeper(
      Constants.PLAYER_GOALKEEPER_POSITION,
      'fish4',
      Side.PLAYER
    )
    this.cursor = new Cursor({ x: 0, y: 0 }, this.game)
    this.selectFish(this.fieldPlayers[this.selectedPlayerIndex])
    this.listenKeyboardInputs()
    this.game.ball.addOnChangedPossessionListener((fish: Fish) => {
      if (fish.side === this.side && fish !== this.goalKeeper.fish) {
        this.selectFish(fish)
      }
    })
  }

  getSelectedFish() {
    return this.cursor.getSelectedFish()
  }

  getBestSupportingPosition() {
    const zoneConfig = {
      upperRight: 6,
      upperLeft: 4,
      lowerRight: 38,
      lowerLeft: 36,
    }
    const { positions, bestPosition } = BestSpotUtil.getBestSupportingSpot(this.game, zoneConfig)
    this.bestPositions = positions
    return bestPosition
  }

  public isOnCurrentFieldSide(position: { x: number; y: number }): boolean {
    return position.x <= Constants.BG_WIDTH / 2
  }

  public getDefensivePositions(): number[] {
    return Constants.PLAYER_DEFEND_POSITIONS
  }

  getEnemyTeam(): Team {
    return this.game.cpu
  }

  switchPlayer() {
    const selectedFish = this.getSelectedFish()
    if (selectedFish) {
      selectedFish.setVelocity(0, 0)
    }
    this.selectedPlayerIndex = (this.selectedPlayerIndex + 1) % this.fieldPlayers.length
    this.selectFish(this.fieldPlayers[this.selectedPlayerIndex])
  }

  selectFish(fish: Fish) {
    const previouslySelected = this.cursor.getSelectedFish()
    if (previouslySelected) {
      previouslySelected.setState(PlayerStates.SUPPORT)
    }
    fish.setState(PlayerStates.PLAYER_CONTROL)
    this.cursor.selectFish(fish)
  }

  stealBall() {
    const fish = this.getSelectedFish()
    if (fish) {
      const distance = Constants.getDistanceBetweenObjects(fish.sprite, this.game.ball.sprite)
      if (distance < Constants.STEAL_DISTANCE) {
        fish.stealBall(this.game.ball)
      }
    }
  }

  public onPassCompleted(passingFish: Fish, receivingFish: Fish): void {
    if (receivingFish !== this.goalKeeper.fish) {
      this.selectFish(receivingFish)
    }
    passingFish.setVelocity(0, 0)
  }

  updateTeamState() {
    if (this.hasPossession()) {
      this.stateMachine.transition(TeamStates.ATTACKING)
    } else {
      this.stateMachine.transition(TeamStates.DEFENDING)
    }
  }

  public reset(isOffense: boolean): void {
    this.stateMachine.transition(TeamStates.KICKOFF)
    super.resetFieldPlayers(
      isOffense
        ? Constants.PLAYER_OFFENSE_KICKOFF_POSITIONS
        : Constants.PLAYER_DEFENSE_KICKOFF_POSITIONS
    )
    this.selectFish(this.fieldPlayers[0])
  }

  public getEnemyGoal() {
    return this.game.cpuGoal
  }

  public getCurrentGoal() {
    return this.game.playerGoal
  }

  update() {
    super.update()
    this.cursor.follow()
    this.handlePlayerMovement()
  }

  listenKeyboardInputs() {
    this.game.input.keyboard.on('keydown', (keyCode) => {
      switch (keyCode.code) {
        case 'KeyA': {
          this.passBall()
          break
        }
        case 'KeyS': {
          const selectedPlayer = this.getSelectedFish()
          if (selectedPlayer && selectedPlayer.hasBall(this.game.ball)) {
            selectedPlayer.kickBall(
              this.game.ball,
              this.game.cpuGoal,
              Constants.SHOOT_SPEED_MULTIPLIER
            )
          }
          break
        }
        case 'KeyD': {
          this.stealBall()
          break
        }
        case 'Space': {
          this.switchPlayer()
          break
        }
        case 'Backquote':
          this.game.debug.setVisible(!this.game.debug.isVisible)
          break
      }
    })
  }

  hasPossession() {
    return this.game.ball.possessionSide == Side.PLAYER
  }

  enemyHasPossession() {
    return this.game.ball.possessionSide == Side.COMPUTER
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
