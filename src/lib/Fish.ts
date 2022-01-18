import Game, { Side } from '~/scenes/Game'
import { Constants } from '~/utils/Constants'
import { Ball, BallState } from './Ball'

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
  }

  hasBall(ball: Ball): boolean {
    return ball.fishWithBall === this
  }

  canTakeBall(ball: Ball): boolean {
    return ball.currState === BallState.LOOSE
  }

  stealBall(ball: Ball) {
    const fishWithBall = ball.fishWithBall
    if (fishWithBall) {
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

  shoot(ball: Ball) {
    this.ballCollider.active = false
    ball.shoot()
    this.scene.time.delayedCall(100, () => {
      this.ballCollider.active = true
    })
  }
}
