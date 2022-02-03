import { Fish } from '~/lib/Fish'
import { Team } from '~/lib/Team'
import { Constants } from '~/utils/Constants'
import { State } from '../StateMachine'

export class DribbleState extends State {
  getClosestDefender(fish: Fish, team: Team): Fish {
    const enemyTeam = team.getEnemyTeam()
    let minDistance = Number.MAX_SAFE_INTEGER
    let closestFish = enemyTeam.fieldPlayers[0]
    for (let i = 0; i < enemyTeam.fieldPlayers.length; i++) {
      const player = enemyTeam.fieldPlayers[i]
      const distance = Constants.getDistanceBetweenObjects(player.sprite, fish.sprite)
      if (distance < minDistance) {
        closestFish = player
        minDistance = distance
      }
    }
    return closestFish
  }

  getBestMovePosition(fish: Fish, team: Team) {
    return team.getEnemyGoal().sprite
  }

  execute(fish: Fish, team: Team) {
    const bestMovePosition = this.getBestMovePosition(fish, team)
    fish.setMoveTarget(bestMovePosition)
  }
}
