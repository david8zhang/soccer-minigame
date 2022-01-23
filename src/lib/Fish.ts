import Game, { Side } from '~/scenes/Game'
import { Ball, BallState } from './Ball'
import { Goal } from './Goal'

export interface FishConfig {
  position: {
    x: number
    y: number
  }
  side: Side
  flipX?: boolean
  texture: string
}

export class Fish {
  private scene: Game
  public sprite: Phaser.Physics.Arcade.Sprite
  public ballCollider: Phaser.Physics.Arcade.Collider
  public ball?: Ball
  public side: Side
  public flipX: boolean = false
  public isStunned: boolean = false
  public homeRegionId: number = 0

  // Rectangle used by AI to do steering
  public markerRectangle: Phaser.Geom.Rectangle

  constructor(fishConfig: FishConfig, scene: Game) {
    const { position, side, texture, flipX } = fishConfig
    this.scene = scene
    const { x, y } = position
    this.side = side

    // Configure sprite
    this.sprite = this.scene.physics.add.sprite(x, y, texture).setDepth(100)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.setPushable(false)
    if (flipX) {
      this.sprite.flipX = true
      this.flipX = true
    }

    // Configure ball collider
    this.ballCollider = this.scene.physics.add.overlap(
      this.scene.ball.sprite,
      this.sprite,
      (obj1, obj2) => {
        const ball = obj1.getData('ref') as Ball
        if (this.canTakeBall(ball)) {
          this.takeBall(ball)
        }
      }
    )
    this.markerRectangle = new Phaser.Geom.Rectangle(
      this.sprite.x,
      this.sprite.y,
      this.sprite.body.width,
      this.sprite.body.height * 4
    )
  }

  setHomeRegionId(id: number) {
    this.homeRegionId = id
  }

  hasBall(ball: Ball): boolean {
    return ball.fishWithBall === this
  }

  canTakeBall(ball: Ball): boolean {
    return ball.currState === BallState.LOOSE
  }

  stealBall(ball: Ball) {
    const fishWithBall = ball.fishWithBall
    if (fishWithBall && fishWithBall !== this) {
      fishWithBall.stun()
    }
    ball.setFishWithBall(this)
  }

  stun() {
    this.scene.cameras.main.shake(100, 0.005)
    this.ballCollider.active = false
    const prevVelocity = this.sprite.body.velocity
    this.isStunned = true
    this.sprite.setVelocity(0, 0)
    this.scene.time.delayedCall(500, () => {
      this.isStunned = false
      this.sprite.setVelocity(prevVelocity.x, prevVelocity.y)
      this.ballCollider.active = true
    })
  }

  setVelocity(xVelocity: number, yVelocity: number) {
    if (this.isStunned) {
      return
    }
    this.sprite.setVelocity(xVelocity, yVelocity)
  }

  setVelocityX(xVelocity: number) {
    if (this.isStunned) {
      return
    }
    this.sprite.setVelocityX(xVelocity)
  }

  setVelocityY(yVelocity: number) {
    if (this.isStunned) {
      return
    }
    this.sprite.setVelocityY(yVelocity)
  }

  takeBall(ball: Ball) {
    ball.setFishWithBall(this)
  }

  setFlipX(flipX: boolean) {
    this.flipX = flipX
    this.sprite.flipX = flipX
  }

  kickBall(ball: Ball, target: { sprite: Phaser.Physics.Arcade.Sprite }) {
    this.ballCollider.active = false
    const angle = Phaser.Math.Angle.BetweenPoints(
      {
        x: this.sprite.x,
        y: this.sprite.y,
      },
      {
        x: target.sprite.x,
        y: target.sprite.y,
      }
    )
    ball.shoot(angle)
    this.scene.time.delayedCall(100, () => {
      this.ballCollider.active = true
    })
  }
}
