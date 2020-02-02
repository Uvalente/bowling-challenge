'use strict'

function Game () {
  this._frames = []
  this.LAST_FRAME = 10
  this._pointsStorage = []
}

Game.prototype.addFrame = function () {
  if (this.frameNumber() === this.LAST_FRAME) throw new Error("This game is over, can't play for ever!")
  if (this.frameNumber() === this.LAST_FRAME - 1) {
    this._frames.push(new LastFrame)
  } else {
    this._frames.push(new Frame())
  }
}

Game.prototype.new = function () {
  for (let i = 0; i < 10; i++) {
    this.addFrame()
  }
}

Game.prototype.frameNumber = function () {
  return this._frames.length
}

Game.prototype.getPoints = function () {
  return this._pointsStorage.reduce((acc, val) => acc + val)
}

Game.prototype.currentFrame = function () {
  return this._frames.find(frame => !frame.isCompleted())
}

Game.prototype.previousFrame = function () {
  const index = this._frames.indexOf(this.currentFrame()) - 1
  return this._frames[index]
}

Game.prototype.nextFrame = function () {
  const index = this._frames.indexOf(this.currentFrame()) + 1
  return this._frames[index]
}

Game.prototype.twoPreviousFrame = function () {
  const index = this._frames.indexOf(this.currentFrame()) - 2
  return this._frames[index]
}

Game.prototype.threePreviousFrame = function () {
  const index = this._frames.indexOf(this.currentFrame()) - 3
  return this._frames[index]
}

Game.prototype.lastFrame = function () {
  return this._frames[this._frames.length - 1]
}

Game.prototype.addPoints = function () {
  if (this.currentFrame() === undefined) {
    this._pointsStorage.push(this.lastFrame().total())
    if (this._frames[8].isSpare()) this._pointsStorage[8] += this.lastFrame().getShot(1)
    if (this._frames[7].isStrike() && this._frames[8].isStrike()) this._pointsStorage[7] += this._frames[8].getShot(1) + this.lastFrame().getShot(1)
    if (this._frames[8].isStrike()) this._pointsStorage[8] += this.lastFrame().getShot(1) + this.lastFrame().getShot(2)
  } else {
    this._pointsStorage.push(this.previousFrame().total())
  }

  if (this.threePreviousFrame() !== undefined && this.threePreviousFrame().isStrike() && this.twoPreviousFrame().isStrike()) {
    this._pointsStorage[this._frames.indexOf(this.threePreviousFrame())] += this.twoPreviousFrame().getShot(1) + this.previousFrame().getShot(1)
  }
  if (this.twoPreviousFrame() !== undefined && this.twoPreviousFrame().isStrike() && !this.previousFrame().isStrike()) {
    this._pointsStorage[this._frames.indexOf(this.twoPreviousFrame())] += this.previousFrame().total()
  }
  if (this.twoPreviousFrame() !== undefined && this.twoPreviousFrame().isSpare()) {
    this._pointsStorage[this._frames.indexOf(this.twoPreviousFrame())] += this.previousFrame().getShot(1)
  }
}
