import Game, { Side } from '~/scenes/Game'
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
        console.log('collided!')
        const ball = obj1.getData('ref') as Ball
        if (this.canTakeBall(ball)) {
          this.dribble(ball)
        }
      }
    )
  }

  canTakeBall(ball: Ball): boolean {
    // The player can take the ball if the ball is currently loose or the ball has been shot by the other team
    return ball.currState === BallState.LOOSE
  }

  dribble(ball: Ball) {
    this.ball = ball
    this.ball.currState = BallState.DRIBBLE
    this.ball.sprite.setVelocity(0, 0)
    const ballXPosition = this.flipX
      ? this.sprite.x - this.sprite.width / 2 - 20
      : this.sprite.x + this.sprite.width / 2 + 20
    this.ball.sprite.setPosition(ballXPosition, this.sprite.y)
  }

  move(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown
    if (!leftDown && !rightDown && !upDown && !downDown) {
      this.sprite.setVelocity(0, 0)
      return
    }
    const speed = 250
    if (leftDown || rightDown) {
      let velocityX = leftDown ? -speed : speed
      this.flipX = leftDown
      this.sprite.flipX = this.flipX
      if (leftDown && rightDown) {
        velocityX = 0
      }
      this.sprite.setVelocityX(velocityX)
    } else {
      this.sprite.setVelocityX(0)
    }

    if (upDown || downDown) {
      let velocityY = upDown ? -speed : speed
      if (upDown && downDown) {
        velocityY = 0
      }
      this.sprite.setVelocityY(velocityY)
    } else {
      this.sprite.setVelocityY(0)
    }
    if (this.ball && this.ball.currState === BallState.DRIBBLE) {
      this.dribble(this.ball)
    }
  }

  shoot() {
    if (this.ball) {
      this.ballCollider.active = false
      this.ball.currState = BallState.LOOSE
      const ball = this.ball
      this.ball = undefined

      const flipVelocity = this.flipX ? -750 : 750
      ball.sprite.setVelocityX(flipVelocity)
      this.scene.time.delayedCall(100, () => {
        this.ballCollider.active = true
      })
    }
  }
}
