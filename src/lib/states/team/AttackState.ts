import { Fish } from '~/lib/Fish'
import { Team } from '~/lib/Team'
import Game from '~/scenes/Game'
import { BestSpotUtil } from '~/utils/BestSpotUtil'
import { Constants } from '~/utils/Constants'
import { State } from '../StateMachine'
import { PlayerStates } from '../StateTypes'

export class AttackState extends State {
  enter(team: Team, game: Game) {
    team.fieldPlayers.forEach((fish: Fish) => {
      if (fish.getCurrentState() !== PlayerStates.PLAYER_CONTROL) {
        if (fish.hasBall(game.ball)) {
          fish.setState(PlayerStates.DRIBBLE)
        } else {
          fish.setState(PlayerStates.SUPPORT)
        }
      }
    })
  }

  isPassSafe(fish: Fish, team: Team) {
    const supportingFish = team.fieldPlayers.find((f) => f !== fish)
    if (supportingFish) {
      const distanceToSupportingFish = Constants.getDistanceBetweenObjects(
        fish.sprite,
        supportingFish.sprite
      )
      const angle = Phaser.Math.Angle.BetweenPoints(
        {
          x: fish.sprite.x,
          y: fish.sprite.y,
        },
        {
          x: supportingFish.sprite.x,
          y: supportingFish.sprite.y,
        }
      )
      const enemyTeamPlayers = team.getEnemyTeam().fieldPlayers
      const line = new Phaser.Geom.Line()
      Phaser.Geom.Line.SetToAngle(
        line,
        fish.sprite.x,
        fish.sprite.y,
        angle,
        distanceToSupportingFish
      )

      // Check if there are any enemy players in the way of a pass
      for (let i = 0; i < enemyTeamPlayers.length; i++) {
        const player = enemyTeamPlayers[i]
        if (Phaser.Geom.Intersects.LineToRectangle(line, player.markerRectangle)) {
          return false
        }
      }
    }
    return true
  }

  shouldPass(fish: Fish, team: Team) {
    const ball = team.getBall().sprite
    let distanceToClosestFish = Number.MAX_SAFE_INTEGER
    const enemyTeam = team.getEnemyTeam().fieldPlayers
    enemyTeam.forEach((enemy) => {
      distanceToClosestFish = Math.min(
        distanceToClosestFish,
        Constants.getDistanceBetweenObjects(ball, enemy.sprite)
      )
    })
    return distanceToClosestFish < Constants.PASS_DISTANCE
  }

  shouldShoot(fish: Fish, team: Team) {
    const currPosition = {
      x: fish.sprite.x,
      y: fish.sprite.y,
    }
    const distanceToEnemyGoal = Constants.getDistanceBetweenObjects(
      fish.sprite,
      team.getEnemyGoal().sprite
    )
    return (
      BestSpotUtil.canScoreGoal(currPosition, team.getEnemyTeam()) &&
      distanceToEnemyGoal < Constants.CPU_WILL_SHOOT_DISTANCE
    )
  }

  assignFishOffensiveState(fish: Fish, team: Team) {
    if (fish.getCurrentState() === PlayerStates.PLAYER_CONTROL) {
      return
    }
    const ball = team.getBall()
    if (fish.hasBall(ball)) {
      if (this.shouldShoot(fish, team)) {
        fish.kickBall(ball, team.getEnemyGoal(), Constants.SHOOT_SPEED_MULTIPLIER)
        return
      }
      if (this.shouldPass(fish, team) && this.isPassSafe(fish, team)) {
        team.passBall()
        return
      }
    } else {
      if (fish.getCurrentState() !== PlayerStates.RECEIVE_PASS) {
        fish.setState(PlayerStates.SUPPORT)
      }
    }
  }

  execute(team: Team) {
    team.fieldPlayers.forEach((fish: Fish) => {
      this.assignFishOffensiveState(fish, team)
    })
  }
}
