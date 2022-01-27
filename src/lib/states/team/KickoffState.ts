import { Team } from '~/lib/Team'
import { Constants } from '~/utils/Constants'
import { State } from '../StateMachine'
import { PlayerStates } from '../StateTypes'

export class KickoffState extends State {
  enter(team: Team) {
    team.resetFieldPlayers([])
  }
  execute(team: Team) {
    team.fieldPlayers.forEach((player) => {
      if (player.getCurrentState() !== PlayerStates.PLAYER_CONTROL) {
        player.setState(PlayerStates.WAIT)
      }
    })
  }
}
