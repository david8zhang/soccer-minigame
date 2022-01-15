import Game from '~/scenes/Game'
import { Player } from './Player'

export enum BallState {
  DRIBBLE,
  LOOSE,
}

export class Ball {
  private scene: Game
  public sprite: Phaser.Physics.Arcade.Sprite
  public currState: BallState = BallState.LOOSE

  constructor(position: { x: number; y: number }, scene: Game) {
    this.scene = scene
    const { x, y } = position
    this.sprite = this.scene.physics.add.sprite(x, y, 'ball').setScale(0.05).setOrigin(0.5)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.setData('ref', this)
    this.sprite.setDepth(200)
  }
}
