import { Fish } from '~/lib/Fish'
import { Team } from '~/lib/Team'
import { State } from '../StateMachine'

export class BlockGoalState extends State {
  execute(fish: Fish, team: Team) {
    const currGoal = team.getCurrentGoal()
    const fishWithBall = team.getBall().fishWithBall
    if (fishWithBall) {
      const midPointBetweenGoal = {
        x: (fishWithBall.sprite.x + currGoal.sprite.x) / 2,
        y: (fishWithBall.sprite.y + currGoal.sprite.y) / 2,
      }
      fish.setMoveTarget(midPointBetweenGoal)
    }
  }
}
