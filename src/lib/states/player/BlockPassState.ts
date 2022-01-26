import { Fish } from '~/lib/Fish'
import { Team } from '~/lib/Team'
import { State } from '../StateMachine'

export class BlockPassState extends State {
  execute(fish: Fish, team: Team) {
    const enemyTeam = team.getEnemyTeam()
    const enemy1 = enemyTeam.fieldPlayers[0]
    const enemy2 = enemyTeam.fieldPlayers[1]
    const midPointPosition = {
      x: (enemy1.sprite.x + enemy2.sprite.x) / 2,
      y: (enemy1.sprite.y + enemy2.sprite.y) / 2,
    }
    fish.setMoveTarget(midPointPosition)
  }
}
