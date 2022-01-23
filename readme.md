# Sakana Soccer

A fish themed soccer minigame with some very rudimentary AI

AI Logic Design

Classes

- Soccer Team
- Player

Soccer Team

- Manages overall positioning of players on the field

  - Divide field into cells, and maintain the "home cells" of each player based on the current
    team state

- Maintains references to "Key" players:

  - Receiving Player: player waiting to receive the ball from another player
  - Closest Player to the ball
  - Player controlling the ball
  - The supporting player

- Has one of 2 possible states:

  1. Attacking
  2. Defending

Player

- Handle player movement
- Player also maintains a global message router to facillitate communication
- Two types of players, Field Players and Goal Keepers

- Field Players maintain the following states:

  1. Wait
  2. ReceiveBall
  3. Dribble
  4. ChaseBall
  5. ReturnToHomeRegion
  6. SupportAttacker

- GoalKeeper players maintain the following states:

  1. TendGoal
  2. ReturnHome
  3. PutBallBackInPlay
  4. InterceptBall
