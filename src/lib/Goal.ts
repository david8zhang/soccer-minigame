import Game from '~/scenes/Game'

export class Goal {
  private scene: Game
  public sprite: Phaser.Physics.Arcade.Sprite
  public ballCollider: Phaser.Physics.Arcade.Collider

  constructor(position: { x: number; y: number }, scene: Game) {
    this.scene = scene
    const { x, y } = position
    this.sprite = this.scene.physics.add.sprite(x, y, 'goal').setScale(2)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.body.setSize(this.sprite.width * 0.2, this.sprite.height * 0.9)
    this.ballCollider = this.scene.physics.add.overlap(this.sprite, this.scene.ball.sprite, () => {
      if (this.checkIfBallIsFullyInsideGoal()) {
        console.log('GOAL!')
      }
    })
  }

  checkIfBallIsFullyInsideGoal() {
    const upperEdgeOfGoal =
      this.sprite.y - this.sprite.displayHeight / 2 + this.sprite.displayHeight * 0.05
    const lowerEdgeOfGoal =
      this.sprite.y + this.sprite.displayHeight / 2 - this.sprite.displayHeight * 0.05
    const upperEdgeOfBall = this.scene.ball.sprite.y - this.scene.ball.sprite.displayHeight / 2
    const lowerEdgeOfBall = this.scene.ball.sprite.y + this.scene.ball.sprite.displayHeight / 2
    if (upperEdgeOfBall > upperEdgeOfGoal && lowerEdgeOfBall < lowerEdgeOfGoal) {
      return true
    }
    return false
  }
}
