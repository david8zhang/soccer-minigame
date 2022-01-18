import Game, { Side } from '~/scenes/Game'
import { Constants, Object } from '~/utils/Constants'
import { Fish } from './Fish'

export class AI {
  private game: Game
  constructor(game: Game) {
    this.game = game
  }

  getFishClosestToObject(object: Object) {
    const enemyTeam = this.game.enemyTeam
    let closestEnemyFish: Fish = enemyTeam[0]
    let minDistance: number = Number.MAX_SAFE_INTEGER
    for (let i = 0; i < enemyTeam.length; i++) {
      const currEnemyFish = enemyTeam[i]
      const distance = Constants.getDistanceBetweenObjects(currEnemyFish, object)
      if (distance < minDistance) {
        minDistance = distance
        closestEnemyFish = currEnemyFish
      }
    }
    return closestEnemyFish
  }

  computerHasBall() {
    return this.game.ball.possessionSide === Side.COMPUTER
  }

  playerHasBall() {
    return this.game.ball.possessionSide === Side.PLAYER
  }

  move() {
    // If the enemy has the ball, move towards the goal and away from the player
    if (this.computerHasBall()) {
      this.moveTowardsGoal()
    }
    // If the player has the ball, follow the player and try to take it from them
    else if (this.playerHasBall()) {
      if (this.canStealBallFromPlayer()) {
        this.stealBall()
      } else {
        this.moveTowardsPlayer()
      }
    }
    // If nobody has the ball,
    else {
      this.moveTowardsObject(this.game.ball)
    }
  }

  stealBall() {
    const playerSelectedFish = this.game.getPlayerSelectedFish()
    if (playerSelectedFish) {
      const fishClosestToPlayer = this.getFishClosestToObject(playerSelectedFish)
      fishClosestToPlayer.stealBall(this.game.ball)
    }
  }

  canStealBallFromPlayer(): boolean {
    const fishClosestToPlayer = this.getFishClosestToObject(this.game.ball)
    const distance = Constants.getDistanceBetweenObjects(fishClosestToPlayer, this.game.ball)
    return distance < Constants.STEAL_DISTANCE && !fishClosestToPlayer.isStunned
  }

  moveTowardsObject(object: Object) {
    const fishClosestToBall = this.getFishClosestToObject(object)
    const angle = Phaser.Math.Angle.BetweenPoints(
      {
        x: fishClosestToBall.sprite.x,
        y: fishClosestToBall.sprite.y,
      },
      {
        x: object.sprite.x,
        y: object.sprite.y,
      }
    )
    const velocityVector = new Phaser.Math.Vector2(0, 0)
    this.game.physics.velocityFromRotation(angle, Constants.FISH_SPEED, velocityVector)
    fishClosestToBall.setFlipX(velocityVector.x < 0)
    fishClosestToBall.setVelocity(velocityVector.x, velocityVector.y)
  }

  moveTowardsGoal() {
    const goal = this.game.playerGoal
    this.moveTowardsObject(goal)
  }

  moveTowardsPlayer() {
    const playerWithBall = this.game.ball.fishWithBall
    if (playerWithBall) {
      this.moveTowardsObject(playerWithBall)
    }
  }

  update() {
    this.move()
  }
}
