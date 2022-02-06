import Phaser from 'phaser'
import { Ball } from '~/lib/Ball'
import { Fish } from '~/lib/Fish'
import { Constants } from '~/utils/Constants'
import { Goal } from '~/lib/Goal'
import { Debug } from '~/lib/Debug'
import { CPU } from '~/lib/CPU'
import { Player } from '~/lib/Player'
import { Score } from '~/lib/Score'

export enum Side {
  PLAYER,
  COMPUTER,
  NONE,
}

export type FieldZone = {
  centerPosition: {
    x: number
    y: number
  }
  id: number
}

export default class Game extends Phaser.Scene {
  // Teams
  public player!: Player
  public cpu!: CPU

  // Field
  public fieldGrid!: FieldZone[][]
  public playerGoal!: Goal
  public cpuGoal!: Goal
  public ball!: Ball

  // Other
  public debug!: Debug

  public score!: Score

  constructor() {
    super('game')
  }

  create() {
    this.initWorldCollider()
    this.initScore()
    this.createField()
    this.createBall()
    this.createGoal()
    this.createTeams()
    this.initializeDebug()
  }

  initWorldCollider() {
    this.physics.world.setBounds(
      0,
      0,
      Constants.BG_WIDTH,
      Constants.BG_HEIGHT,
      true,
      true,
      true,
      true
    )
  }

  initScore() {
    this.score = new Score(this)
  }

  initializeDebug() {
    this.debug = new Debug(this)
    this.debug.setVisible(false)
  }

  createField() {
    const bgImage = this.add.image(Constants.BG_WIDTH / 2, Constants.BG_HEIGHT / 2, 'bg')
    bgImage.setScale(Constants.BG_WIDTH / bgImage.width, Constants.BG_HEIGHT / bgImage.height)
    this.cameras.main.setBounds(0, 0, Constants.BG_WIDTH, Constants.BG_HEIGHT)
    this.cameras.main.setBackgroundColor(0x000000)
    bgImage.setAlpha(0.75)
    this.scale.setGameSize(1600, 1200)

    // Create a field grid
    let fieldZoneID: number = 0
    const numZoneColumns = Constants.BG_WIDTH / Constants.FIELD_ZONE_WIDTH
    const numZoneRows = Constants.BG_HEIGHT / Constants.FIELD_ZONE_HEIGHT
    this.fieldGrid = new Array(numZoneRows)
      .fill(0)
      .map(() => new Array(numZoneColumns).fill(undefined))

    for (let i = 0; i < this.fieldGrid.length; i++) {
      for (let j = 0; j < this.fieldGrid[0].length; j++) {
        this.fieldGrid[i][j] = {
          centerPosition: {
            x: j * Constants.FIELD_ZONE_WIDTH + Constants.FIELD_ZONE_WIDTH / 2,
            y: i * Constants.FIELD_ZONE_HEIGHT + Constants.FIELD_ZONE_HEIGHT / 2,
          },
          id: fieldZoneID++,
        }
      }
    }
  }

  getZoneForZoneId(zoneId: number) {
    for (let i = 0; i < this.fieldGrid.length; i++) {
      for (let j = 0; j < this.fieldGrid[0].length; j++) {
        if (this.fieldGrid[i][j].id === zoneId) {
          return this.fieldGrid[i][j]
        }
      }
    }
    return null
  }

  createTeams() {
    this.player = new Player(this)
    this.cpu = new CPU(this)
  }

  createBall() {
    const ballXPos = Constants.BG_WIDTH / 2
    const ballYPos = Constants.BG_HEIGHT / 2
    this.ball = new Ball({ x: ballXPos, y: ballYPos }, this)
  }

  reset(sideScoredOn: Side) {
    if (sideScoredOn === Side.PLAYER) {
      this.score.incrementCPUScore()
    } else {
      this.score.incrementPlayerScore()
    }

    this.ball.reset()
    this.cpu.reset(sideScoredOn === Side.COMPUTER)
    this.player.reset(sideScoredOn === Side.PLAYER)
  }

  createGoal() {
    this.playerGoal = new Goal({ x: 50, y: Constants.BG_HEIGHT / 2 }, this, Side.PLAYER)
    this.cpuGoal = new Goal(
      { x: Constants.BG_WIDTH - 50, y: Constants.BG_HEIGHT / 2 },
      this,
      Side.COMPUTER
    )
  }

  getPlayerSelectedFish(): Fish | undefined {
    return this.player.getSelectedFish()
  }

  update() {
    this.player.update()
    this.cpu.update()
    this.ball.update()
    this.debug.update()
  }
}
