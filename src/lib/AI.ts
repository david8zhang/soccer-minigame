import Game, { Side } from '~/scenes/Game'
import { Constants, Object } from '~/utils/Constants'
import { Fish } from './Fish'

export class AI {
  private game: Game
  public static DISTANCE_TO_GOAL = 500
  public isShooting: boolean = false

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
    if (this.isShooting) {
      return
    }
    // If the enemy has the ball, move towards the goal and away from the player
    if (this.computerHasBall()) {
      if (this.withinShootingRange()) {
        this.shootBall()
      } else {
        this.moveTowardsGoal()
      }
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
      // this.moveTowardsObject(this.game.ball)
    }
  }

  stealBall() {
    const playerSelectedFish = this.game.getPlayerSelectedFish()
    if (playerSelectedFish) {
      const fishClosestToPlayer = this.getFishClosestToObject(playerSelectedFish)
      fishClosestToPlayer.stealBall(this.game.ball)
    }
  }

  shootBall() {
    const fishWithBall = this.game.ball.fishWithBall
    if (fishWithBall) {
      this.isShooting = true
      fishWithBall.setVelocity(0, 0)
      fishWithBall.shoot(this.game.ball, this.game.playerGoal)
      this.game.time.delayedCall(1000, () => {
        this.isShooting = false
      })
    }
  }

  withinShootingRange() {
    const fishWithBall = this.game.ball.fishWithBall
    if (fishWithBall) {
      const distance = Constants.getDistanceBetweenObjects(fishWithBall, this.game.playerGoal)
      return distance < AI.DISTANCE_TO_GOAL
    }
    return false
  }

  canStealBallFromPlayer(): boolean {
    const fishClosestToPlayer = this.getFishClosestToObject(this.game.ball)
    const distance = Constants.getDistanceBetweenObjects(fishClosestToPlayer, this.game.ball)
    return distance < Constants.STEAL_DISTANCE && !fishClosestToPlayer.isStunned
  }

  moveTowardsObject(fish: Fish, object: Object) {
    const angle = Phaser.Math.Angle.BetweenPoints(
      {
        x: fish.sprite.x,
        y: fish.sprite.y,
      },
      {
        x: object.sprite.x,
        y: object.sprite.y,
      }
    )
    const velocityVector = new Phaser.Math.Vector2(0, 0)
    this.game.physics.velocityFromRotation(angle, Constants.FISH_SPEED, velocityVector)
    fish.setFlipX(velocityVector.x < 0)
    fish.setVelocity(velocityVector.x, velocityVector.y)
  }

  getBestAngleAwayFromPlayerFish(selectedFish: Fish, playerFish: Fish) {
    const angleToGoal = Phaser.Math.Angle.BetweenPoints(
      {
        x: selectedFish.sprite.x,
        y: selectedFish.sprite.y,
      },
      {
        x: this.game.playerGoal.sprite.x,
        y: this.game.playerGoal.sprite.y,
      }
    )
    let resultAngle = angleToGoal
    let minDiff = Number.MAX_SAFE_INTEGER
    const angles: number[] = []
    for (let i = -30; i <= 30; i += 15) {
      angles.push(Phaser.Math.DegToRad(i))
    }
    for (let i = 120; i <= 180; i += 15) {
      angles.push(Phaser.Math.DegToRad(i))
    }
    angles.forEach((diff) => {
      const line = new Phaser.Geom.Line()
      const newAngle = angleToGoal + diff
      Phaser.Geom.Line.SetToAngle(
        line,
        selectedFish.sprite.x,
        selectedFish.sprite.y,
        newAngle,
        Constants.BG_WIDTH
      )
      if (
        !Phaser.Geom.Intersects.LineToRectangle(line, playerFish.markerRectangle) &&
        diff < minDiff
      ) {
        this.game.graphics.lineStyle(1, 0x00ff00)
        minDiff = diff
        resultAngle = newAngle
      } else {
        this.game.graphics.lineStyle(1, 0xff0000)
      }
      this.game.graphics.strokeLineShape(line)
    })
    return resultAngle
  }

  moveTowardsGoal() {
    this.game.enemyTeam.forEach((fish) => {
      let angle = this.getBestAngleAwayFromPlayerFish(
        fish,
        this.game.getPlayerSelectedFish() as Fish
      )
      const velocityVector = new Phaser.Math.Vector2()
      this.game.physics.velocityFromRotation(angle, Constants.FISH_SPEED, velocityVector)
      fish.setFlipX(velocityVector.x < 0)
      fish.setVelocity(velocityVector.x, velocityVector.y)
    })
  }

  moveTowardsPlayer() {
    const playerWithBall = this.game.ball.fishWithBall
    if (playerWithBall) {
      this.game.enemyTeam.forEach((fish) => {
        this.moveTowardsObject(fish, playerWithBall)
      })
    }
  }

  update() {
    this.move()
  }
}
