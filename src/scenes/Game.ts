import Phaser from 'phaser'
import { Ball } from '~/lib/Ball'
import { InputController } from '~/lib/InputController'
import { Fish } from '~/lib/Fish'
import { Constants } from '~/utils/Constants'

export enum Side {
  PLAYER,
  COMPUTER,
}

export default class Game extends Phaser.Scene {
  public playerTeam: Fish[] = []
  public enemyTeam: Fish[] = []
  public inputController!: InputController
  public ball!: Ball

  constructor() {
    super('game')
  }

  create() {
    this.createField()
    this.createBall()
    this.createFish()
    this.initializeInputController()
  }

  createField() {
    const bgImage = this.add.image(Constants.BG_WIDTH / 2, Constants.BG_HEIGHT / 2, 'bg')
    bgImage.setScale(Constants.BG_WIDTH / bgImage.width, Constants.BG_HEIGHT / bgImage.height)
    this.cameras.main.setBounds(0, 0, Constants.BG_WIDTH, Constants.BG_HEIGHT)
    this.cameras.main.setBackgroundColor(0x000000)
    bgImage.setAlpha(0.75)
    // this.scale.setGameSize(1600, 1200)
  }

  initializeInputController() {
    this.inputController = new InputController(this)
  }

  createBall() {
    const ballXPos = Constants.BG_WIDTH / 2
    const ballYPos = Constants.BG_HEIGHT / 2
    this.ball = new Ball({ x: ballXPos, y: ballYPos }, this)
  }

  createFish() {
    const spacing = 50
    const numFishPerTeam = 1
    let fishYPos = Constants.BG_HEIGHT / 2
    const fishXPos = Constants.BG_WIDTH / 2 - Constants.BG_WIDTH / 5
    for (let i = 0; i < numFishPerTeam; i++) {
      const fish = new Fish(
        { position: { x: fishXPos, y: fishYPos }, texture: 'fish4', side: Side.PLAYER },
        this
      )
      this.playerTeam.push(fish)
      fishYPos += spacing
    }

    let enemyYPos = Constants.BG_HEIGHT / 2
    const enemyXPos = Constants.BG_WIDTH / 2 + Constants.BG_WIDTH / 5
    for (let i = 0; i < numFishPerTeam; i++) {
      const fish = new Fish(
        {
          position: { x: enemyXPos, y: enemyYPos },
          side: Side.COMPUTER,
          texture: 'fish2',
          flipX: true,
        },
        this
      )
      this.enemyTeam.push(fish)
      enemyYPos += spacing
    }
  }

  update() {
    this.inputController.update()
  }
}
