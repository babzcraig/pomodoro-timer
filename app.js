'use strict';

let expect = require('expect');

// Declare variables at top of file
let convertToSeconds,
  convertToMiliseconds,
  pomodoroTimer,
  setBreakCounter,
  updateSession,
  pomodoro,
  breakTimer;

pomodoro = {
  counter: null,
  session: 0,
  breakCounter: null,
  SHORT_BREAK: 0.0625,
  LONG_BREAK: 0.125,
  TIME: 0.125
}

convertToSeconds = function convertToSeconds(a) {
  // convert minutes into seconds
  return Math.floor(a * 60);
};

convertToMiliseconds = function convertToMiliseconds(a) {
  // convert minutes into miliseconds
  return a * 60 * 1000;
};

setBreakCounter = function setBreakCounter(session) {
  let breakCounter;
  if (session >= 4 && session % 4 === 0) {
    breakCounter = pomodoro.LONG_BREAK;
  } else {
    breakCounter = pomodoro.SHORT_BREAK;
  }
  return breakCounter;
}

breakTimer = function breakTimer() {
  let countdown, startCountdown, stopCountdown;

  stopCountdown = function stopCountdown() {
    clearInterval(countdown);
    pomodoroTimer();
  };

  startCountdown = function startCountdown() {
    pomodoro.breakCounter--;
    if (pomodoro.breakCounter < 0) {
      pomodoro.breakCounter = 0;
      stopCountdown();
      return;
    };
    console.log('break time: ', pomodoro.breakCounter);
  }

  pomodoro.breakCounter = convertToSeconds(setBreakCounter(pomodoro.session));
  countdown = setInterval(startCountdown, 1000);
}

pomodoroTimer = function pomodoroTimer() {
  let startCountdown, stopCountdown, countdown;
  // Set the global pomodoro counter

  startCountdown = function startCountdown() {
    pomodoro.counter--;
    if (pomodoro.counter < 0) {
      pomodoro.counter = 0;
      stopCountdown();
      return;
    };
    console.log('timer: ', pomodoro.counter);
  };

  stopCountdown = function stopCountdown() {
    clearInterval(countdown);
    pomodoro.session++;
    breakTimer();

  }

  pomodoro.counter = convertToSeconds(pomodoro.TIME);
  countdown = setInterval(startCountdown, 1000);
}



//Unit Tests
it('should accept x minutes and convert to seconds', function testConvertSecs() {
  let secs30 = convertToSeconds(0.5),
    mins2 = convertToSeconds(2),
    mins25 = convertToSeconds(25);

  expect(secs30).toBe(30);
  expect(mins2).toBe(120);
  expect(mins25).toBe(1500);
});

it('should accept x minuntes and convert to miliseconds', function testConvertMiliSecs() {
  let secs30 = convertToMiliseconds(0.5),
    mins2 = convertToMiliseconds(2),
    mins25 = convertToMiliseconds(25);

  expect(secs30).toBe(30000);
  expect(mins2).toBe(120000);
  expect(mins25).toBe(1500000);
})

it('should start a countdownTimer and update the session count by one', function testStartCtdwnTimer(done) {
  this.timeout(15000);
  pomodoroTimer(0.125);
  // Test after the interval has finished running
  setTimeout(function() {
    expect(pomodoro.counter).toBe(0);
    expect(pomodoro.session).toBe(1);
    done();
  }, 10000);
});

it('setBreakTimer should set break based on session count', function testSetBreakCounter(done) {
  var break1 = setBreakCounter(1),
    break2 = setBreakCounter(5),
    break3 = setBreakCounter(4),
    break4 = setBreakCounter(8);

    expect(break1).toBe(5);
    expect(break2).toBe(5);
    expect(break3).toBe(10);
    expect(break4).toBe(10);
    done();
});

it('should start and run a break timer', function testBreakTimer(done) {
  this.timeout(15000);
  breakTimer();
  // Test after the interval has finished running
  setTimeout(function() {
    console.log('I ran');
    expect(pomodoro.breakCounter).toBe(0);
    done();
  }, 10000);
});