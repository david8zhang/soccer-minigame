import Phaser from 'phaser'
import { Ball } from '~/lib/Ball'
import { InputController } from '~/lib/InputController'
import { Fish } from '~/lib/Fish'
import { Constants } from '~/utils/Constants'
import { Goal } from '~/lib/Goal'
import { AI } from '~/lib/AI'

export enum Side {
  PLAYER,
  COMPUTER,
  NONE,
}

export default class Game extends Phaser.Scene {
  public playerTeam: Fish[] = []
  public enemyTeam: Fish[] = []
  public inputController!: InputController
  public ball!: Ball
  public playerGoal!: Goal
  public enemyGoal!: Goal
  public ai!: AI
  public graphics!: Phaser.GameObjects.Graphics

  constructor() {
    super('game')
  }

  create() {
    this.graphics = this.add.graphics()
    this.graphics.lineStyle(2, 0x00ff00)
    this.createField()
    this.createBall()
    this.createFish()
    this.createGoal()
    this.initializeInputController()
    this.initializeAI()
  }

  createField() {
    const bgImage = this.add.image(Constants.BG_WIDTH / 2, Constants.BG_HEIGHT / 2, 'bg')
    bgImage.setScale(Constants.BG_WIDTH / bgImage.width, Constants.BG_HEIGHT / bgImage.height)
    this.cameras.main.setBounds(0, 0, Constants.BG_WIDTH, Constants.BG_HEIGHT)
    this.cameras.main.setBackgroundColor(0x000000)
    bgImage.setAlpha(0.75)
    this.scale.setGameSize(1600, 1200)
  }

  initializeInputController() {
    this.inputController = new InputController(this)
  }

  initializeAI() {
    this.ai = new AI(this)
  }

  createBall() {
    const ballXPos = Constants.BG_WIDTH / 2
    const ballYPos = Constants.BG_HEIGHT / 2
    this.ball = new Ball({ x: ballXPos, y: ballYPos }, this)
  }

  reset() {
    this.ball.reset()
    this.resetFishPositions()
    this.scene.resume()
  }

  createGoal() {
    this.playerGoal = new Goal({ x: 50, y: Constants.BG_HEIGHT / 2 }, this)
    this.enemyGoal = new Goal({ x: Constants.BG_WIDTH - 50, y: Constants.BG_HEIGHT / 2 }, this)
  }

  getPlayerSelectedFish(): Fish | undefined {
    return this.inputController.getPlayerSelectedFish()
  }

  resetFishPositions() {
    const spacing = 50
    const numFishPerTeam = 1
    let fishYPos = Constants.BG_HEIGHT / 2
    const fishXPos = Constants.BG_WIDTH / 2 - Constants.BG_WIDTH / 5
    for (let i = 0; i < numFishPerTeam; i++) {
      this.playerTeam[i].sprite.setPosition(fishXPos, fishYPos)
      fishYPos += spacing
    }
    let enemyYPos = Constants.BG_HEIGHT / 2
    const enemyXPos = Constants.BG_WIDTH / 2 + Constants.BG_WIDTH / 5
    for (let i = 0; i < numFishPerTeam; i++) {
      this.enemyTeam[i].sprite.setPosition(enemyXPos, enemyYPos)
      enemyYPos += spacing
    }
  }

  createFish() {
    const spacing = 50
    const numFishPerTeam = 2
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
    this.updateGraphics()
    this.inputController.update()
    this.ai.update()
    this.ball.update()
    this.updateAllFish()
  }

  updateGraphics() {
    this.graphics.clear()
    this.graphics.lineStyle(2, 0x00ff00)
  }

  updateAllFish() {
    this.playerTeam.forEach((fish) => fish.update())
    this.enemyTeam.forEach((fish) => fish.update())
  }
}
