import { Fish } from '~/lib/Fish'
import { Team } from '~/lib/Team'
import { State } from '../StateMachine'

export class ReceivePassState extends State {
  execute(fish: Fish, team: Team) {
    fish.setMoveTarget(team.getBall().sprite)
  }
}
