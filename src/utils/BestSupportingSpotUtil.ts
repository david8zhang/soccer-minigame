import { Fish } from '~/lib/Fish'
import { Team } from '~/lib/Team'
import Game from '~/scenes/Game'
import { Constants } from './Constants'

export interface ZoneConfig {
  upperLeft: number
  upperRight: number
  lowerLeft: number
  lowerRight: number
}

export class BestSupportingSpotUtil {
  static ABLE_TO_PASS = 5
  static ABLE_TO_SCORE_GOAL = 3
  static DISTANCE_TO_PLAYER = 2
  static OPTIMAL_DISTANCE = 300

  static getBestSupportingSpot(
    game: Game,
    zoneConfig: ZoneConfig
  ): {
    positions: { x: number; y: number }[]
    bestPosition: { x: number; y: number }
  } {
    const supportPositionCandidates: any[] = []
    const upperLeftZone = game.getZoneForZoneId(zoneConfig.upperLeft)
    const lowerLeftZone = game.getZoneForZoneId(zoneConfig.lowerLeft)
    const upperRightZone = game.getZoneForZoneId(zoneConfig.upperRight)
    const lowerRightZone = game.getZoneForZoneId(zoneConfig.lowerRight)
    if (upperRightZone && lowerLeftZone && upperLeftZone && lowerRightZone) {
      let startX = upperLeftZone?.centerPosition.x
      let endX = upperRightZone?.centerPosition.x
      let startY = upperLeftZone?.centerPosition.y
      let endY = lowerLeftZone?.centerPosition.y
      let xIncrement = Constants.FIELD_ZONE_WIDTH / 2
      let yIncrement = Constants.FIELD_ZONE_HEIGHT / 2
      for (let x = startX; x <= endX; x += xIncrement) {
        for (let y = startY; y <= endY; y += yIncrement) {
          supportPositionCandidates.push({ x, y })
        }
      }
    }
    let maxScore = 0
    let bestPosition = supportPositionCandidates[0]
    const positionsWithScore = supportPositionCandidates.map((position) => {
      const score = this.getScoreForSpot(position, game, game.player)
      if (score > maxScore) {
        maxScore = score
        bestPosition = position
      }
      return { ...position, radius: Math.max(5, score * 5) }
    })
    return { positions: positionsWithScore, bestPosition }
  }

  static getScoreForSpot(spot: { x: number; y: number }, game: Game, team: Team) {
    const fishWithBall = game.ball.fishWithBall!
    if (!fishWithBall) {
      return 0
    }
    let currScore = 0
    if (this._canPassToSpot(spot, fishWithBall, team.getEnemyTeam())) {
      currScore += this.ABLE_TO_PASS
    }
    if (this._canScoreGoal(spot, team.getEnemyTeam())) {
      currScore += this.ABLE_TO_SCORE_GOAL
    }
    const distanceToFishWithBall = Constants.getDistanceBetweenObjects(fishWithBall.sprite, spot)
    const diff = Math.abs(this.OPTIMAL_DISTANCE - distanceToFishWithBall)
    if (distanceToFishWithBall < this.OPTIMAL_DISTANCE) {
      currScore +=
        this.DISTANCE_TO_PLAYER * ((this.OPTIMAL_DISTANCE - diff) / this.OPTIMAL_DISTANCE)
    }
    return currScore
  }

  private static _canPassToSpot(
    spot: { x: number; y: number },
    fishWithBall: Fish,
    enemyTeam: Team
  ) {
    const ray = new Phaser.Geom.Line()
    const angle = Phaser.Math.Angle.BetweenPoints(spot, fishWithBall.sprite)
    const distance = Constants.getDistanceBetweenObjects(spot, fishWithBall.sprite)
    Phaser.Geom.Line.SetToAngle(ray, spot.x, spot.y, angle, distance)
    for (let i = 0; i < enemyTeam.fieldPlayers.length; i++) {
      const enemyFish = enemyTeam.fieldPlayers[i]
      if (Phaser.Geom.Intersects.LineToRectangle(ray, enemyFish.markerRectangle)) {
        return false
      }
    }
    return true
  }

  private static _canScoreGoal(spot: { x: number; y: number }, enemyTeam: Team) {
    const goal = enemyTeam.getCurrentGoal()
    const ray = new Phaser.Geom.Line()
    const angle = Phaser.Math.Angle.BetweenPoints(spot, goal.sprite)
    const distance = Constants.getDistanceBetweenObjects(spot, goal.sprite)
    Phaser.Geom.Line.SetToAngle(ray, spot.x, spot.y, angle, distance)
    for (let i = 0; i < enemyTeam.fieldPlayers.length; i++) {
      const enemyFish = enemyTeam.fieldPlayers[i]
      if (Phaser.Geom.Intersects.LineToRectangle(ray, enemyFish.markerRectangle)) {
        return false
      }
    }
    return true
  }

  static getBestSupportingSpotCPU(game: Game) {}
}
