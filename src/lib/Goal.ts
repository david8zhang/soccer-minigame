import Game, { Side } from '~/scenes/Game'

export class Goal {
  private game: Game
  public sprite: Phaser.Physics.Arcade.Sprite
  public ballCollider: Phaser.Physics.Arcade.Collider
  public side: Side
  public splashEffectSprite!: Phaser.Physics.Arcade.Sprite
  public hasScored: boolean = false

  constructor(position: { x: number; y: number }, game: Game, side: Side) {
    this.game = game
    const { x, y } = position
    this.sprite = this.game.physics.add.sprite(x, y, 'goal').setScale(2)
    this.game.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.body.setSize(this.sprite.width * 0.2, this.sprite.height * 0.9)
    this.ballCollider = this.game.physics.add.overlap(this.sprite, this.game.ball.sprite, () => {
      this.onScore()
    })
    this.side = side
    this.setupSplashEffect()
  }

  setupSplashEffect() {
    const angle = this.side === Side.PLAYER ? 90 : 270
    const xPos = this.side === Side.PLAYER ? this.sprite.x + 50 : this.sprite.x - 50
    this.splashEffectSprite = this.game.physics.add
      .sprite(xPos, this.sprite.y, 'splash')
      .setAngle(angle)
      .setScale(2)
  }

  onScore() {
    if (this.checkIfBallIsFullyInsideGoal() && !this.hasScored) {
      this.hasScored = true
      this.game.ball.sprite.setVisible(false)
      this.game.cameras.main.shake(50, 0.005)
      this.splashEffectSprite.play('goal-score')
      this.game.time.delayedCall(700, () => {
        this.game.onScoredText.setVisible(true)
        this.game.scene.pause()
        const timeout = setTimeout(() => {
          this.game.reset(this.side)
          this.hasScored = false
          clearTimeout(timeout)
        }, 1000)
      })
    }
  }

  checkIfBallIsFullyInsideGoal() {
    const upperEdgeOfGoal =
      this.sprite.y - this.sprite.displayHeight / 2 + this.sprite.displayHeight * 0.05
    const lowerEdgeOfGoal =
      this.sprite.y + this.sprite.displayHeight / 2 - this.sprite.displayHeight * 0.05
    const upperEdgeOfBall = this.game.ball.sprite.y - this.game.ball.sprite.displayHeight / 2
    const lowerEdgeOfBall = this.game.ball.sprite.y + this.game.ball.sprite.displayHeight / 2
    if (upperEdgeOfBall > upperEdgeOfGoal && lowerEdgeOfBall < lowerEdgeOfGoal) {
      return true
    }
    return false
  }
}
