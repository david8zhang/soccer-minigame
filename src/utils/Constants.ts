import { Fish } from '~/lib/Fish'

export type Object = {
  x: number
  y: number
}

export class Constants {
  // Field attributes
  static BG_WIDTH: number = 1600
  static BG_HEIGHT: number = 1200
  static FIELD_ZONE_WIDTH: number = 200
  static FIELD_ZONE_HEIGHT: number = 240

  // Fish attributes
  static FISH_SPEED: number = 250
  static SHOOT_SPEED_MULTIPLIER: number = 4
  static STEAL_DISTANCE: number = 50
  static PASS_DISTANCE: number = 150

  // AI Attributes
  static CPU_WILL_STEAL_DISTANCE: number = 250
  static CPU_WILL_BLOCK_DISTANCE: number = 500
  static CPU_WILL_SHOOT_DISTANCE: number = 750

  // Team attributes
  static NUM_FIELD_PLAYERS_PER_TEAM = 2
  static CPU_KICKOFF_POSITIONS = [13, 29]
  static CPU_ATTACK_POSITIONS = [10, 21]
  static CPU_DEFEND_POSITIONS = [14, 30]
  static CPU_GOALKEEPER_POSITION = 23
  static PLAYER_GOALKEEPER_POSITION = 16
  static PLAYER_KICKOFF_POSITIONS = [10, 26]
  static PLAYER_ATTACK_POSITIONS = [13, 18]
  static PLAYER_DEFEND_POSITIONS = [9, 25]

  static getDistanceBetweenObjects(obj1: Object, obj2: Object) {
    const pos1 = { x: obj1.x, y: obj1.y }
    const pos2 = { x: obj2.x, y: obj2.y }
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2))
  }
}
