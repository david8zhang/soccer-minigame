import Game from '~/scenes/Game'
import { Constants } from '~/utils/Constants'
import { Fish } from './Fish'
import { Player } from './Player'
import { PlayerStates } from './states/StateTypes'
import { Team } from './Team'

export interface GoalKeeperConfig {
  fish: Fish
  homeRegionId: number
  team: Team
}

export class GoalKeeper {
  public static CHASE_DISTANCE = 100

  public fish: Fish
  public game: Game
  public team: Team
  constructor(game: Game, config: GoalKeeperConfig) {
    this.game = game
    this.fish = config.fish
    this.fish.setHomeRegionId(config.homeRegionId)
    this.team = config.team
  }

  reset() {
    const homeRegion = this.fish.getHomeRegion()!
    const { centerPosition } = homeRegion
    this.fish.sprite.setPosition(centerPosition.x, centerPosition.y)
  }

  update() {
    const ball = this.game.ball
    const fishWithBall = ball.fishWithBall
    if (fishWithBall === this.fish) {
      this.team.passBall()
    } else {
      // if (fishWithBall) {
      //   const distanceToFishWithBall = Constants.getDistanceBetweenObjects(
      //     this.fish.sprite,
      //     fishWithBall.sprite
      //   )
      //   if (distanceToFishWithBall < GoalKeeper.CHASE_DISTANCE) {
      //     this.fish.setState(PlayerStates.CHASE_BALL_STATE)
      //   } else {
      //     this.fish.setState(PlayerStates.BLOCK_GOAL_STATE)
      //   }
      // } else {
      //   this.fish.setState(PlayerStates.BLOCK_GOAL_STATE)
      // }
    }
    this.fish.update()
  }
}
