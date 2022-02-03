import Game, { Side } from '~/scenes/Game'
import { ZoneConfig } from '~/utils/BestSpotUtil'
import { Constants } from '~/utils/Constants'
import { Ball } from './Ball'
import { Fish } from './Fish'
import { Goal } from './Goal'
import { GoalKeeper } from './GoalKeeper'
import { StateMachine } from './states/StateMachine'
import { PlayerStates, TeamStates } from './states/StateTypes'
import { AttackState } from './states/team/AttackState'
import { DefendState } from './states/team/DefendState'
import { KickoffState } from './states/team/KickoffState'

export abstract class Team {
  protected game: Game
  public side: Side = Side.NONE
  public fieldPlayers: Fish[] = []
  public stateMachine!: StateMachine
  public goalKeeper!: GoalKeeper
  constructor(game: Game) {
    this.game = game
    this.stateMachine = new StateMachine(
      TeamStates.KICKOFF,
      {
        [TeamStates.ATTACKING]: new AttackState(),
        [TeamStates.DEFENDING]: new DefendState(),
        [TeamStates.KICKOFF]: new KickoffState(),
      },
      [this, this.game]
    )
    this.configureBall()
  }

  configureBall() {
    const ball = this.game.ball
    ball.addOnChangedPossessionListener((newFish) => {
      this.onChangedPossession(newFish)
    })
  }

  getBall(): Ball {
    return this.game.ball
  }

  createGoalKeeper(zoneId: number, playerTexture: string, side: Side) {
    const zone = this.game.getZoneForZoneId(zoneId)!
    const { centerPosition } = zone
    const fish = new Fish(
      {
        position: centerPosition,
        side: side,
        texture: playerTexture,
        flipX: side == Side.COMPUTER,
        team: this,
      },
      this.game
    )
    return new GoalKeeper(this.game, {
      team: this,
      fish: fish,
      homeRegionId: zoneId,
    })
  }

  createFieldPlayers(
    numFieldPlayers: number,
    playerTexture: string,
    side: Side,
    startingPositions?: number[]
  ): Fish[] {
    const players: Fish[] = []
    const positions = startingPositions || Constants.PLAYER_KICKOFF_POSITIONS
    for (let i = 0; i < numFieldPlayers; i++) {
      const zoneId = positions[i]
      if (zoneId) {
        const zone = this.game.getZoneForZoneId(zoneId)
        if (zone) {
          const { centerPosition } = zone
          const fish = new Fish(
            {
              position: centerPosition,
              side: side,
              texture: playerTexture,
              flipX: side == Side.COMPUTER,
              team: this,
            },
            this.game
          )
          fish.setHomeRegionId(zoneId)
          players.push(fish)
        }
      }
    }
    return players
  }

  public abstract reset(): void

  public setState(state: TeamStates) {
    this.stateMachine.transition(state)
  }

  public resetFieldPlayers(positions: number[]) {
    this.fieldPlayers.forEach((fish: Fish, index: number) => {
      const zoneId = positions[index]
      const zone = this.game.getZoneForZoneId(zoneId)
      if (zone) {
        fish.sprite.setPosition(zone.centerPosition.x, zone.centerPosition.y)
      }
    })
  }

  public getGoalKeeperMarkerRectangle() {
    return this.goalKeeper.fish.markerRectangle
  }

  public passBall() {
    const fishWithBall = this.game.ball.fishWithBall
    if (fishWithBall && fishWithBall.team.side === this.side) {
      const supportingFish = this.fieldPlayers.find((f: Fish) => f !== fishWithBall)
      if (supportingFish) {
        fishWithBall.kickBall(this.game.ball, supportingFish)
        supportingFish.setState(PlayerStates.RECEIVE_PASS)
        const timeEvent = this.game.time.addEvent({
          repeat: -1,
          delay: 10,
          callback: () => {
            if (this.game.ball.fishWithBall === supportingFish) {
              this.onPassCompleted(fishWithBall, supportingFish)
              timeEvent.destroy()
            }
          },
        })
      }
    }
  }

  public abstract onPassCompleted(passingFish: Fish, receivingFish: Fish): void

  public onChangedPossession(newFishWithBall: Fish): void {
    if (newFishWithBall.team.side !== this.side) {
      this.stateMachine.transition(TeamStates.DEFENDING)
    } else {
      this.stateMachine.transition(TeamStates.ATTACKING)
    }
  }
  public abstract getBestSupportingPosition(): { x: number; y: number }
  public abstract getEnemyGoal(): Goal
  public abstract getCurrentGoal(): Goal
  public abstract getEnemyTeam(): Team
  public abstract isOnCurrentFieldSide(position: { x: number; y: number }): boolean
  public abstract getDefensivePositions(): number[]

  public update() {
    this.stateMachine.step()
    this.fieldPlayers.forEach((fish: Fish) => {
      fish.update()
    })
    if (this.goalKeeper) {
      this.goalKeeper.update()
    }
  }
}
