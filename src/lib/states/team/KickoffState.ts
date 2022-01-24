import { Team } from '~/lib/Team'
import { State } from '../StateMachine'
import { PlayerStates } from '../StateTypes'

export class KickoffState extends State {
  execute(team: Team) {
    team.fieldPlayers.forEach((player) => {
      if (player.getCurrentState() !== PlayerStates.PLAYER_CONTROL) {
        player.setState(PlayerStates.WAIT)
      }
    })
  }
}
