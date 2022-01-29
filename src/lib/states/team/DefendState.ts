import { Fish } from '~/lib/Fish'
import { Player } from '~/lib/Player'
import { Team } from '~/lib/Team'
import { Constants } from '~/utils/Constants'
import { State } from '../StateMachine'
import { PlayerStates } from '../StateTypes'

export class DefendState extends State {
  withinStealRange(team: Team, fish: Fish) {
    const ball = team.getBall()
    const fishWithBall = ball.fishWithBall
    if (fishWithBall) {
      const distance = Constants.getDistanceBetweenObjects(fish.sprite, fishWithBall.sprite)
      if (distance < Constants.CPU_WILL_STEAL_DISTANCE) {
        return true
      }
    }
    return false
  }

  enter(team: Team) {
    const teamDefensivePositions = team.getDefensivePositions()
    team.fieldPlayers.forEach((fish: Fish, index: number) => {
      const defensiveHomeRegion = teamDefensivePositions[index]
      if (fish.getCurrentState() !== PlayerStates.PLAYER_CONTROL) {
        fish.setHomeRegionId(defensiveHomeRegion)
        fish.setState(PlayerStates.RETURN_TO_HOME)
      }
    })
  }
  execute(team: Team) {
    team.fieldPlayers.forEach((fish: Fish, index: number) => {
      if (fish.getCurrentState() !== PlayerStates.PLAYER_CONTROL) {
        if (this.withinStealRange(team, fish)) {
          fish.setState(PlayerStates.CHASE_BALL_STATE)
        } else {
          fish.setState(PlayerStates.RETURN_TO_HOME)
        }
      }
    })
  }
}
