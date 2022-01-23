import Game, { Side } from '~/scenes/Game'
import { Constants } from '~/utils/Constants'
import { Fish } from './Fish'

export type CPUConfig = {
  side: Side
  numFieldPlayers: number
  playerTexture: string
}

export class CPU {
  private game: Game
  public fieldPlayers: Fish[]

  constructor(game: Game) {
    this.game = game
    this.fieldPlayers = this.createFieldPlayers(Constants.NUM_FIELD_PLAYERS_PER_TEAM, 'fish2')
  }

  createFieldPlayers(numFieldPlayers: number, playerTexture: string): Fish[] {
    const players: Fish[] = []
    const positions = Constants.CPU_KICKOFF_POSITIONS
    for (let i = 0; i < numFieldPlayers; i++) {
      const zoneId = positions[i]
      if (zoneId) {
        const zone = this.game.getZoneForZoneId(zoneId)
        if (zone) {
          const { centerPosition } = zone
          const fish = new Fish(
            {
              position: { x: centerPosition.x, y: centerPosition.y },
              side: Side.COMPUTER,
              texture: playerTexture,
              flipX: true,
            },
            this.game
          )
          players.push(fish)
        }
      }
    }
    return players
  }
}
