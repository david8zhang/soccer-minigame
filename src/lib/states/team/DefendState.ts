import { Fish } from '~/lib/Fish'
import { Team } from '~/lib/Team'
import { State } from '../StateMachine'
import { PlayerStates } from '../StateTypes'

export class DefendState extends State {
  enter(team: Team) {
    const teamDefensivePositions = team.getDefensivePositions()
    team.fieldPlayers.forEach((fish: Fish, index: number) => {
      const defensiveHomeRegion = teamDefensivePositions[index]
      if (fish.getCurrentState() !== PlayerStates.PLAYER_CONTROL) {
        fish.setHomeRegionId(defensiveHomeRegion)
        fish.setState(PlayerStates.RETURN_TO_HOME)
      }
    })
  }
}
