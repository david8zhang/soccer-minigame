import { Fish } from '~/lib/Fish'

export type Object = {
  sprite: Phaser.Physics.Arcade.Sprite
}

export class Constants {
  static BG_WIDTH: number = 1600
  static BG_HEIGHT: number = 1200
  static FISH_SPEED: number = 250
  static SHOOT_VELOCITY: number = 750
  static STEAL_DISTANCE: number = 50

  static getDistanceBetweenObjects(obj1: Object, obj2: Object) {
    const pos1 = { x: obj1.sprite.x, y: obj1.sprite.y }
    const pos2 = { x: obj2.sprite.x, y: obj2.sprite.y }
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2))
  }
}
