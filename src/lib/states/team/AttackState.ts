import { Fish } from '~/lib/Fish'
import { Team } from '~/lib/Team'
import Game from '~/scenes/Game'
import { State } from '../StateMachine'
import { PlayerStates } from '../StateTypes'

export class AttackState extends State {
  execute(team: Team, game: Game) {
    team.fieldPlayers.forEach((fish: Fish) => {
      if (fish.getCurrentState() !== PlayerStates.PLAYER_CONTROL) {
        if (fish.hasBall(game.ball)) {
          fish.setState(PlayerStates.DRIBBLE)
        } else {
          fish.setState(PlayerStates.SUPPORT)
        }
      }
    })
  }
}
