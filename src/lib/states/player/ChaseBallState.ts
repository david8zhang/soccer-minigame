import { Fish } from '~/lib/Fish'
import { Team } from '~/lib/Team'
import { State } from '../StateMachine'

export class ChaseBall extends State {
  execute(fish: Fish, team: Team) {
    const ball = team.getBall()
    fish.setMoveTarget(ball.sprite)
  }
}
