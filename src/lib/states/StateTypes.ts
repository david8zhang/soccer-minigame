export enum PlayerStates {
  PLAYER_CONTROL = 'PlayerControl',
  WAIT = 'Wait',
  SUPPORT = 'Support',
  DRIBBLE = 'Dribble',
  RECEIVE_PASS = 'ReceivePass',
  CHASE_BALL_STATE = 'ChaseBallState',
  BLOCK_GOAL_STATE = 'BlockGoalState',
  RETURN_TO_HOME = 'ReturnToHome',
}

export enum TeamStates {
  ATTACKING = 'Attacking',
  DEFENDING = 'Defending',
  KICKOFF = 'Kickoff',
}
