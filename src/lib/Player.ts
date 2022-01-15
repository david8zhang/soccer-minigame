import Game from '~/scenes/Game'

export class Player {
  private scene: Game
  public sprite: Phaser.GameObjects.Rectangle
  constructor(position: { x: number; y: number }, color: number, scene: Game) {
    this.scene = scene
    const { x, y } = position
    this.sprite = this.scene.add.rectangle(x, y, 20, 40, color).setDepth(10)
  }

  get x() {
    return this.sprite.x
  }
  get y() {
    return this.sprite.y
  }

  get width() {
    return this.sprite.width
  }

  get depth() {
    return this.sprite.depth
  }
}
