import { Fish } from '~/lib/Fish'
import { State } from '../StateMachine'

export class ReturnToHome extends State {
  execute(fish: Fish) {
    const homeRegion = fish.getHomeRegion()
    if (homeRegion) {
      fish.setMoveTarget(homeRegion.centerPosition)
    }
  }
}
