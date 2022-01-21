# Sakana Soccer

A combination of Feeding Frenzy and Soccer, you play as a fish who must score goals in an underwater game of soccer. You can eat pellets of food to grow bigger, and being bigger enables you to use speed boosts, shoot the ball faster, and defend better

## AI Implementation

AI fish can have two roles:

1. Attack
2. Defense

Attack:

- Go for the ball if it's loose
- If I have the ball:
  - If near the enemy, attempt to avoid the enemy until a passing lane opens
  - If near the goal and open shooting lane, shoot. Else, avoid the enemy and try to pass
- If my team has the ball
  - go to one of three possible positions some distance away from the goal. Pick the position
    that is furthest away from any enemies

Defense:

- Stay in the player's passing lanes
- If the player is near the goal, stay in the player's goal lanes or move towards them
- If near the player within a certain radius, attempt to steal the ball, else go back to above 2 behaviors
