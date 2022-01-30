import Game from '~/scenes/Game'

export class Goal {
  private game: Game
  public sprite: Phaser.Physics.Arcade.Sprite
  public ballCollider: Phaser.Physics.Arcade.Collider

  constructor(position: { x: number; y: number }, game: Game) {
    this.game = game
    const { x, y } = position
    this.sprite = this.game.physics.add.sprite(x, y, 'goal').setScale(2)
    this.game.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.body.setSize(this.sprite.width * 0.2, this.sprite.height * 0.9)
    this.ballCollider = this.game.physics.add.overlap(this.sprite, this.game.ball.sprite, () => {
      this.onScore()
    })
  }

  onScore() {
    if (this.checkIfBallIsFullyInsideGoal()) {
      console.log('Should reset!')
      this.game.reset()
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
