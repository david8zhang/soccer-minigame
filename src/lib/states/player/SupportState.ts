import { Fish } from '../../Fish'
import { Team } from '../../Team'
import { State } from '../StateMachine'

export class SupportState extends State {
  execute(fish: Fish, team: Team) {
    const bestSupportingPosition = team.getBestSupportingPosition()
    fish.setMoveTarget(bestSupportingPosition)
  }
}
