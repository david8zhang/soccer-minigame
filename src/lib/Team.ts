import Game, { Side } from '~/scenes/Game'
import { Constants } from '~/utils/Constants'
import { Fish } from './Fish'
import { Goal } from './Goal'
import { StateMachine } from './states/StateMachine'
import { TeamStates } from './states/StateTypes'
import { AttackState } from './states/team/AttackState'
import { DefendState } from './states/team/DefendState'
import { KickoffState } from './states/team/KickoffState'

export abstract class Team {
  protected game: Game
  public side: Side = Side.NONE
  public fieldPlayers: Fish[] = []
  public stateMachine!: StateMachine
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
              position: { x: centerPosition.x, y: centerPosition.y },
              side: side,
              texture: playerTexture,
              flipX: side == Side.COMPUTER,
              team: this,
            },
            this.game
          )
          fish.addOnGetBallListener(() => this.onPlayerGetBall())
          players.push(fish)
        }
      }
    }
    return players
  }

  public abstract onPlayerGetBall(): void
  public abstract getBestSupportingPosition(): { x: number; y: number }
  public abstract getEnemyGoal(): Goal
  public abstract getCurrentGoal(): Goal
  public abstract getEnemyTeam(): Team
  public update() {
    this.stateMachine.step()
  }
}
