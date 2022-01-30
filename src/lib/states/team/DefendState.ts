import { CPU } from '~/lib/CPU'
import { Fish } from '~/lib/Fish'
import { Player } from '~/lib/Player'
import { Team } from '~/lib/Team'
import { Constants } from '~/utils/Constants'
import { State } from '../StateMachine'
import { PlayerStates } from '../StateTypes'

enum DefenseRegions {
  UPPER = 'upper',
  LOWER = 'lower',
}

export class DefendState extends State {
  withinChaseRange(team: Team, fish: Fish) {
    const ball = team.getBall()
    const fishWithBall = ball.fishWithBall
    if (fishWithBall) {
      const distance = Constants.getDistanceBetweenObjects(fish.sprite, fishWithBall.sprite)
      return (
        distance < Constants.CPU_WILL_STEAL_DISTANCE &&
        team.isOnCurrentFieldSide(fishWithBall.sprite)
      )
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

  assignFishDefensiveState(fish: Fish, team: Team) {
    const fishWithBall = team.getBall().fishWithBall
    if (fish.getCurrentState() == PlayerStates.PLAYER_CONTROL) {
      return
    }
    if (!fishWithBall) {
      return
    }

    const defensiveRegion =
      fish.getHomeRegion()!.id < 20 ? DefenseRegions.UPPER : DefenseRegions.LOWER
    const fishWithBallRegion =
      fishWithBall.sprite.y < Constants.BG_HEIGHT / 2 ? DefenseRegions.UPPER : DefenseRegions.LOWER
    if (defensiveRegion === fishWithBallRegion) {
      if (this.withinChaseRange(team, fish)) {
        const ball = team.getBall()
        if (fish.canStealBall(ball)) {
          fish.stealBall(ball)
        } else {
          fish.setState(PlayerStates.CHASE_BALL_STATE)
        }
        return
      } else {
        fish.setState(PlayerStates.BLOCK_GOAL_STATE)
        return
      }
    } else {
      fish.setState(PlayerStates.RETURN_TO_HOME)
      return
    }
  }

  execute(team: Team) {
    team.fieldPlayers.forEach((fish: Fish) => {
      this.assignFishDefensiveState(fish, team)
    })
  }
}
