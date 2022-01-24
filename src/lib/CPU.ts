import Game, { Side } from '~/scenes/Game'
import { Constants } from '~/utils/Constants'
import { StateMachine } from './states/StateMachine'
import { TeamStates } from './states/StateTypes'
import { AttackState } from './states/team/AttackState'
import { DefendState } from './states/team/DefendState'
import { Team } from './Team'

export class CPU extends Team {
  constructor(game: Game) {
    super(game)
    this.game = game
    this.side = Side.COMPUTER

    this.fieldPlayers = this.createFieldPlayers(
      Constants.NUM_FIELD_PLAYERS_PER_TEAM,
      'fish2',
      this.side,
      Constants.CPU_KICKOFF_POSITIONS
    )
  }
  public onPlayerGetBall() {
    this.stateMachine.transition(TeamStates.ATTACKING)
  }
  public getEnemyGoal() {
    return this.game.playerGoal
  }
  public getCurrentGoal() {
    return this.game.cpuGoal
  }
  public getBestSupportingPosition() {
    return { x: 0, y: 0 }
  }
  public getEnemyTeam() {
    return this.game.player
  }
}
