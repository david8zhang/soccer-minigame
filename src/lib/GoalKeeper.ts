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
  public static GOALIE_SPEED = 100

  public fish: Fish
  public game: Game
  public team: Team
  public goalPosition: { x: number; y: number }

  constructor(game: Game, config: GoalKeeperConfig) {
    this.game = game
    this.fish = config.fish
    this.fish.setHomeRegionId(config.homeRegionId)
    this.fish.setSpeed(GoalKeeper.GOALIE_SPEED)
    this.team = config.team
    this.goalPosition = this.game.getZoneForZoneId(config.homeRegionId)!.centerPosition
  }

  reset() {
    const homeRegion = this.fish.getHomeRegion()!
    const { centerPosition } = homeRegion
    this.fish.sprite.setPosition(centerPosition.x, centerPosition.y)
  }

  getBestInterceptionSpot() {
    let startX = this.goalPosition.x - Constants.FIELD_ZONE_WIDTH / 4
    let endX = this.goalPosition.x + Constants.FIELD_ZONE_WIDTH / 4
    let startY = this.goalPosition.y - Constants.FIELD_ZONE_HEIGHT / 2
    let endY = this.goalPosition.y + Constants.FIELD_ZONE_HEIGHT / 2

    let spot = { x: this.goalPosition.x, y: this.goalPosition.y }
    let minDistance = Number.MAX_SAFE_INTEGER

    for (let x = startX; x <= endX; x += 40) {
      for (let y = startY; y <= endY; y += 40) {
        const distance = Constants.getDistanceBetweenObjects({ x, y }, this.game.ball.sprite)
        if (distance < minDistance) {
          spot = { x, y }
          minDistance = distance
        }
      }
    }
    return spot
  }

  moveFishToBestInterceptionSpot(spot: { x: number; y: number }) {
    this.fish.setMoveTarget(spot)
  }

  update() {
    const ball = this.game.ball
    const fishWithBall = ball.fishWithBall
    if (fishWithBall === this.fish) {
      this.team.passBall()
    } else {
      const bestInterceptionSpot = this.getBestInterceptionSpot()
      if (this.team.isOnCurrentFieldSide(this.game.ball.sprite)) {
        this.moveFishToBestInterceptionSpot(bestInterceptionSpot)
      }
    }
    // this.getBestInterceptionSpot()
    this.fish.update()
  }
}
