import { Fish } from '../../Fish'
import { State } from '../StateMachine'

export class PlayerControlState extends State {
  enter(fish: Fish) {
    fish.setMoveTarget(null)
    fish.setVelocity(0, 0)
  }
}
