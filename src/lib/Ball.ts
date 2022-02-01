import Game, { Side } from '~/scenes/Game'
import { Constants } from '~/utils/Constants'
import { Fish } from './Fish'

export enum BallState {
  DRIBBLE,
  LOOSE,
}

export class Ball {
  private scene: Game
  public sprite: Phaser.Physics.Arcade.Sprite
  public currState: BallState = BallState.LOOSE
  public fishWithBall: Fish | null = null
  public onChangedPossession: Function[] = []

  constructor(position: { x: number; y: number }, scene: Game) {
    this.scene = scene
    const { x, y } = position
    this.sprite = this.scene.physics.add.sprite(x, y, 'ball').setScale(0.05).setOrigin(0.5)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.setData('ref', this)
    this.sprite.setDepth(200)
    this.sprite.body.bounce.setTo(0.5, 0.5)

    const spriteBody = this.sprite.body as Phaser.Physics.Arcade.Body
    spriteBody.setCollideWorldBounds(true)
    spriteBody.onWorldBounds = true
  }

  get possessionSide() {
    if (!this.fishWithBall) {
      return Side.NONE
    }
    return this.fishWithBall.side
  }

  addOnChangedPossessionListener(listener: Function) {
    this.onChangedPossession.push(listener)
  }

  setFishWithBall(fishWithBall: Fish) {
    this.fishWithBall = fishWithBall
    this.currState = BallState.DRIBBLE
    this.onChangedPossession.forEach((listener) => {
      listener(fishWithBall)
    })
  }

  shoot(angle: number, speedMultiplier: number = 2) {
    if (this.fishWithBall) {
      const velocityVector = new Phaser.Math.Vector2(0, 0)
      this.scene.physics.velocityFromRotation(angle, Constants.FISH_SPEED, velocityVector)
      this.sprite.setVelocity(
        velocityVector.x * speedMultiplier,
        velocityVector.y * speedMultiplier
      )
      this.fishWithBall = null
      this.currState = BallState.LOOSE
    }
  }

  update() {
    if (this.fishWithBall) {
      const fishWithBallSprite = this.fishWithBall.sprite
      this.sprite.setVelocity(0, 0)
      const ballXPosition = this.fishWithBall.flipX
        ? fishWithBallSprite.x - fishWithBallSprite.width / 2 - 20
        : fishWithBallSprite.x + fishWithBallSprite.width / 2 + 20
      this.sprite.setPosition(ballXPosition, fishWithBallSprite.y)
    }
  }

  reset() {
    const ballXPos = Constants.BG_WIDTH / 2
    const ballYPos = Constants.BG_HEIGHT / 2
    this.sprite.setPosition(ballXPos, ballYPos)
    this.sprite.setVelocity(0)
    this.fishWithBall = null
    this.currState = BallState.LOOSE
    this.sprite.setVisible(true)
  }
}
