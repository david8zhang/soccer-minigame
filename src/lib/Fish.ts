import Game, { Side } from '~/scenes/Game'
import { Constants } from '~/utils/Constants'
import { Ball, BallState } from './Ball'
import { PlayerControlState } from './states/player/PlayerControlState'
import { StateMachine } from './states/StateMachine'
import { PlayerStates } from './states/StateTypes'
import { SupportState } from './states/player/SupportState'
import { WaitState } from './states/player/WaitState'
import { Team } from './Team'
import { DribbleState } from './states/player/DribbleState'
import { ReceivePassState } from './states/player/ReceivePassState'
import { ReturnToHome } from './states/player/ReturnToHomeState'
import { ChaseBall } from './states/player/ChaseBallState'
import { BlockGoalState } from './states/player/BlockGoalState'

export interface FishConfig {
  position: {
    x: number
    y: number
  }
  side: Side
  flipX?: boolean
  texture: string
  team: Team
}

export class Fish {
  private game: Game
  public sprite: Phaser.Physics.Arcade.Sprite
  public ballCollider: Phaser.Physics.Arcade.Collider
  public ball?: Ball
  public side: Side
  public team: Team
  public flipX: boolean = false
  public isStunned: boolean = false
  public moveTarget: { x: number; y: number } | null = null
  public stateMachine: StateMachine
  public onGetBallListeners: Function[] = []

  public speed: number = Constants.FISH_SPEED

  // Rectangle used by AI to do steering
  public markerRectangle: Phaser.Geom.Rectangle
  public homeRegionId: number = 0

  constructor(fishConfig: FishConfig, game: Game) {
    const { position, side, texture, flipX, team } = fishConfig
    this.game = game
    const { x, y } = position
    this.side = side
    this.team = team

    // Configure sprite
    this.sprite = this.game.physics.add.sprite(x, y, texture).setDepth(100)
    this.game.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.setPushable(false)

    // Configure world bounds collider
    const spriteBody = this.sprite.body as Phaser.Physics.Arcade.Body
    spriteBody.setCollideWorldBounds(true)
    spriteBody.onWorldBounds = true

    if (flipX) {
      this.sprite.flipX = true
      this.flipX = true
    }

    // Configure ball collider
    this.ballCollider = this.game.physics.add.overlap(
      this.game.ball.sprite,
      this.sprite,
      (obj1, obj2) => {
        const ball = obj1.getData('ref') as Ball
        if (this.canTakeBall(ball)) {
          this.takeBall(ball)
        }
      }
    )
    this.markerRectangle = new Phaser.Geom.Rectangle(
      this.sprite.x,
      this.sprite.y,
      this.sprite.body.width,
      this.sprite.body.height * 4
    )

    this.stateMachine = new StateMachine(
      PlayerStates.WAIT,
      {
        [PlayerStates.SUPPORT]: new SupportState(),
        [PlayerStates.WAIT]: new WaitState(),
        [PlayerStates.PLAYER_CONTROL]: new PlayerControlState(),
        [PlayerStates.DRIBBLE]: new DribbleState(),
        [PlayerStates.RECEIVE_PASS]: new ReceivePassState(),
        [PlayerStates.RETURN_TO_HOME]: new ReturnToHome(),
        [PlayerStates.CHASE_BALL_STATE]: new ChaseBall(),
        [PlayerStates.BLOCK_GOAL_STATE]: new BlockGoalState(),
      },
      [this, this.team]
    )
  }

  setHomeRegionId(id: number) {
    this.homeRegionId = id
  }

  getHomeRegion() {
    return this.game.getZoneForZoneId(this.homeRegionId)
  }

  setState(state: string) {
    this.stateMachine.transition(state)
  }

  getCurrentState(): string {
    return this.stateMachine.getState()
  }

  setMoveTarget(moveTarget: { x: number; y: number } | null) {
    this.moveTarget = moveTarget
  }

  hasBall(ball: Ball): boolean {
    return ball.fishWithBall === this
  }

  canTakeBall(ball: Ball): boolean {
    return ball.currState === BallState.LOOSE
  }

  addOnGetBallListener(listener: Function) {
    this.onGetBallListeners.push(listener)
  }

  canStealBall(ball: Ball) {
    const fishWithBall = ball.fishWithBall
    if (fishWithBall && fishWithBall !== this && !this.isStunned) {
      const distance = Constants.getDistanceBetweenObjects(this.sprite, fishWithBall.sprite)
      if (distance < Constants.STEAL_DISTANCE) {
        return true
      }
    }
    return false
  }

  stealBall(ball: Ball) {
    const fishWithBall = ball.fishWithBall
    if (fishWithBall && fishWithBall !== this) {
      fishWithBall.stun()
    }
    ball.setFishWithBall(this)
  }

  stun() {
    this.game.cameras.main.shake(100, 0.005)
    this.ballCollider.active = false
    const prevVelocity = this.sprite.body.velocity
    this.isStunned = true
    this.sprite.setVelocity(0, 0)
    this.game.time.delayedCall(500, () => {
      this.isStunned = false
      this.sprite.setVelocity(prevVelocity.x, prevVelocity.y)
      this.ballCollider.active = true
    })
  }

  setSpeed(speed: number) {
    this.speed = speed
  }

  setVelocity(xVelocity: number, yVelocity: number) {
    if (this.isStunned) {
      return
    }
    if (xVelocity < 0) {
      this.setFlipX(true)
    }
    if (xVelocity > 0) {
      this.setFlipX(false)
    }
    this.sprite.setVelocity(xVelocity, yVelocity)
  }

  setVelocityX(xVelocity: number) {
    if (this.isStunned) {
      return
    }
    if (xVelocity < 0) {
      this.setFlipX(true)
    }
    if (xVelocity > 0) {
      this.setFlipX(false)
    }
    this.sprite.setVelocityX(xVelocity)
  }

  setVelocityY(yVelocity: number) {
    if (this.isStunned) {
      return
    }
    this.sprite.setVelocityY(yVelocity)
  }

  takeBall(ball: Ball) {
    ball.setFishWithBall(this)
    this.onGetBallListeners.forEach((listener) => listener(this))
  }

  update() {
    Phaser.Geom.Rectangle.CenterOn(this.markerRectangle, this.sprite.x, this.sprite.y)
    this.stateMachine.step()
    this.moveTowardsTarget()
  }

  getBlockingEnemyFish(angle: number) {
    const enemyTeam = this.team.getEnemyTeam()
    const enemyPlayers = enemyTeam.fieldPlayers
    const ray = new Phaser.Geom.Line()
    const distanceToMoveTarget = Constants.getDistanceBetweenObjects(this.sprite, this.moveTarget!)
    Phaser.Geom.Line.SetToAngle(ray, this.sprite.x, this.sprite.y, angle, distanceToMoveTarget)
    for (let i = 0; i < enemyPlayers.length; i++) {
      const player = enemyPlayers[i]
      if (Phaser.Geom.Intersects.LineToRectangle(ray, player.markerRectangle)) {
        return player
      }
    }
  }

  moveTowardsTarget() {
    if (this.moveTarget) {
      const distance = Constants.getDistanceBetweenObjects(this.sprite, this.moveTarget)
      if (Math.abs(distance) < 5) {
        this.setVelocity(0, 0)
      } else {
        let angle = Phaser.Math.Angle.BetweenPoints(
          {
            x: this.sprite.x,
            y: this.sprite.y,
          },
          {
            x: this.moveTarget.x,
            y: this.moveTarget.y,
          }
        )
        // Avoid enemy if there is one in the vicinity
        const blockingEnemyFish = this.getBlockingEnemyFish(angle)
        if (blockingEnemyFish) {
          console.log(angle)
          angle = this.getBestAngleAwayFromPlayerFish(blockingEnemyFish, this.moveTarget)
        }
        const velocityVector = new Phaser.Math.Vector2()
        this.game.physics.velocityFromRotation(angle, this.speed, velocityVector)
        this.setVelocity(velocityVector.x, velocityVector.y)
      }
    }
  }

  getBestAngleAwayFromPlayerFish(fish: Fish, moveTarget: { x: number; y: number }) {
    const angleToGoal = Phaser.Math.Angle.BetweenPoints(
      {
        x: this.sprite.x,
        y: this.sprite.y,
      },
      {
        x: moveTarget.x,
        y: moveTarget.y,
      }
    )
    let resultAngle = angleToGoal
    let minDiff = Number.MAX_SAFE_INTEGER
    const angles: number[] = []
    for (let i = -30; i <= 30; i += 15) {
      angles.push(Phaser.Math.DegToRad(i))
    }
    for (let i = 120; i <= 180; i += 15) {
      angles.push(Phaser.Math.DegToRad(i))
    }
    angles.forEach((diff) => {
      const line = new Phaser.Geom.Line()
      const newAngle = angleToGoal + diff
      Phaser.Geom.Line.SetToAngle(line, this.sprite.x, this.sprite.y, newAngle, Constants.BG_WIDTH)
      if (!Phaser.Geom.Intersects.LineToRectangle(line, fish.markerRectangle) && diff < minDiff) {
        minDiff = diff
        resultAngle = newAngle
      }
    })
    return resultAngle
  }

  setFlipX(flipX: boolean) {
    this.flipX = flipX
    this.sprite.flipX = flipX
  }

  kickBallAtAngle(ball: Ball, angle: number, speedMultiplier: number = 2) {
    this.ballCollider.active = false
    ball.shoot(angle, speedMultiplier)
    this.game.time.delayedCall(500, () => {
      this.ballCollider.active = true
    })
  }

  kickBall(
    ball: Ball,
    target: { sprite: Phaser.Physics.Arcade.Sprite },
    speedMultiplier: number = 2
  ) {
    this.ballCollider.active = false
    const angle = Phaser.Math.Angle.BetweenPoints(
      {
        x: this.sprite.x,
        y: this.sprite.y,
      },
      {
        x: target.sprite.x,
        y: target.sprite.y,
      }
    )
    ball.shoot(angle, speedMultiplier)
    this.game.time.delayedCall(500, () => {
      this.ballCollider.active = true
    })
  }
}
