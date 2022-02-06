export const createSplashAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'goal-score',
    frames: anims.generateFrameNames('splash', {
      start: 0,
      end: 7,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })
}
