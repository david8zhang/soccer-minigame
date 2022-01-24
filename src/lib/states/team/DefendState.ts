import { Fish } from '~/lib/Fish'
import { Team } from '~/lib/Team'
import { State } from '../StateMachine'
import { PlayerStates } from '../StateTypes'

export class DefendState extends State {
  execute(team: Team) {
    team.fieldPlayers.forEach((fish: Fish) => {
      fish.setState(PlayerStates.WAIT)
    })
  }
}
