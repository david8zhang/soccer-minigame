import Phaser from 'phaser'
import { InputController } from '~/lib/InputController'
import { Player } from '~/lib/Player'

export default class Game extends Phaser.Scene {
  public playerTeam: Player[] = []
  public enemyTeam: Player[] = []
  public inputController!: InputController

  constructor() {
    super('game')
  }

  create() {
    this.createField()
    this.createPlayers()
    this.createBall()
    this.initializeInputController()
  }

  createField() {
    const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'field')
    this.cameras.main.setBackgroundColor('#93c47d')
  }

  initializeInputController() {
    this.inputController = new InputController(this)
  }

  createBall() {}

  createPlayers() {
    const spacing = 50
    const numPlayersPerTeam = 3
    let playerYPos = this.scale.height / 2
    const playerXPos = 20
    for (let i = 0; i < numPlayersPerTeam; i++) {
      const player = new Player({ x: playerXPos, y: playerYPos }, 0x0000ff, this)
      this.playerTeam.push(player)
      playerYPos += spacing
    }

    let enemyYPos = this.scale.height / 2
    const enemyXPos = this.scale.width - 20
    for (let i = 0; i < numPlayersPerTeam; i++) {
      const player = new Player({ x: enemyXPos, y: enemyYPos }, 0xff0000, this)
      this.enemyTeam.push(player)
      enemyYPos += spacing
    }
  }
}
