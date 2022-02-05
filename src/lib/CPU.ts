import Game, { Side } from '~/scenes/Game'
import { BestSpotUtil } from '~/utils/BestSpotUtil'
import { Constants } from '~/utils/Constants'
import { Fish } from './Fish'
import { TeamStates } from './states/StateTypes'
import { Team } from './Team'

export class CPU extends Team {
  public bestPositions: { x: number; y: number; radius?: number }[] = []

  constructor(game: Game) {
    super(game)
    this.game = game
    this.side = Side.COMPUTER

    this.fieldPlayers = this.createFieldPlayers(
      Constants.NUM_FIELD_PLAYERS_PER_TEAM,
      'fish2',
      this.side,
      Constants.CPU_DEFENSE_KICKOFF_POSITIONS,
      Constants.FISH_SPEED * 1.25
    )
    this.goalKeeper = this.createGoalKeeper(Constants.CPU_GOALKEEPER_POSITION, 'fish2', this.side)
  }

  public getDefensivePositions(): number[] {
    return Constants.CPU_DEFEND_POSITIONS
  }
  public isOnCurrentFieldSide(position: { x: number; y: number }): boolean {
    return position.x > Constants.BG_WIDTH / 2
  }
  public getEnemyGoal() {
    return this.game.playerGoal
  }
  public getCurrentGoal() {
    return this.game.cpuGoal
  }

  reset(isOffense: boolean) {
    this.stateMachine.transition(TeamStates.KICKOFF)
    super.resetFieldPlayers(
      isOffense ? Constants.CPU_OFFENSE_KICKOFF_POSITIONS : Constants.CPU_DEFENSE_KICKOFF_POSITIONS
    )
    this.fieldPlayers.forEach((player) => player.setFlipX(true))
  }

  public getBestSupportingPosition() {
    const zoneConfig = {
      upperLeft: 1,
      upperRight: 3,
      lowerLeft: 33,
      lowerRight: 35,
    }
    const result = BestSpotUtil.getBestSupportingSpot(this.game, zoneConfig)
    this.bestPositions = result.positions
    return result.bestPosition
  }

  public onPassCompleted(passingFish: Fish, receivingFish: Fish): void {
    return
  }

  public getEnemyTeam() {
    return this.game.player
  }
}
