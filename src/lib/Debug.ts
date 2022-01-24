import Game from '~/scenes/Game'
import { Constants } from '~/utils/Constants'
import { Fish } from './Fish'

export class Debug {
  private game: Game
  private objects: Phaser.GameObjects.Group
  public isVisible: boolean = false
  public alpha: number = 0.5
  public fishStates: Phaser.GameObjects.Text[] = []
  public bestPlayerSupportPositions: any[] = []

  constructor(game: Game) {
    this.game = game
    this.objects = this.game.add.group()
    this.debugFieldGrid()
    this.debugAllFishStates()
    this.debugSupportingPositions()
  }

  debugFieldGrid() {
    const fieldGrid = this.game.fieldGrid
    for (let i = 0; i < fieldGrid.length; i++) {
      for (let j = 0; j < fieldGrid[0].length; j++) {
        const { centerPosition, id } = fieldGrid[i][j]
        const zoneRect = this.game.add
          .rectangle(
            centerPosition.x,
            centerPosition.y,
            Constants.FIELD_ZONE_WIDTH,
            Constants.FIELD_ZONE_HEIGHT,
            0x000000,
            0
          )
          .setStrokeStyle(5, 0x00ff00, this.alpha)
        const text = this.game.add
          .text(centerPosition.x, centerPosition.y, id.toString())
          .setAlpha(this.alpha)
        this.objects.add(zoneRect)
        this.objects.add(text)
      }
    }
  }

  debugSupportingPositions() {
    this.bestPlayerSupportPositions.forEach((circle) => circle.destroy())
    this.bestPlayerSupportPositions = []
    this.game.player.bestPositions.forEach((coordinates) => {
      const { x, y, radius } = coordinates
      const circle = this.game.add.circle(x, y, radius ? radius : 5, 0x00ff00)
      this.bestPlayerSupportPositions.push(circle)
    })
  }

  debugAllFishStates() {
    const showStateText = (fish: Fish) => {
      const state = fish.getCurrentState()
      const stateText = this.game.add.text(
        fish.sprite.x - fish.sprite.displayWidth / 2,
        fish.sprite.y - 50,
        state
      )
      stateText.setData('ref', fish)
      this.fishStates.push(stateText)
      this.objects.add(stateText)
    }
    this.game.cpu.fieldPlayers.forEach(showStateText)
    this.game.player.fieldPlayers.forEach(showStateText)
  }

  setVisible(isVisible: boolean) {
    this.isVisible = isVisible
    this.objects.setVisible(isVisible)
  }

  update() {
    this.fishStates.forEach((text: Phaser.GameObjects.Text) => {
      const fishRef = text.getData('ref') as Fish
      text.setText(fishRef.getCurrentState())
      text.setPosition(fishRef.sprite.x - fishRef.sprite.displayWidth / 2, fishRef.sprite.y - 50)
    })
    this.debugSupportingPositions()
  }
}
