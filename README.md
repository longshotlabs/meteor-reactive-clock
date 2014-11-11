aldeed:clock
=========================

An accurate reactive clock package for Meteor. Retains elapsed time and keeps ticking across hot code reloads.

## Installation

In your Meteor app directory, enter:

```
$ meteor add aldeed:clock
```

## Usage

```js
var ExerciseClock = new ReactiveClock("ExerciseClock");
ExerciseClock.start();
ExerciseClock.stop();
ExerciseClock.setElapsedSeconds(30);

// reactive
var elapsedSeconds = ExerciseClock.elapsedTime();

// reactive; requires momentjs library
var elapsedTimeHumanized = ExerciseClock.elapsedTime({humanize: true, suffix: true});

// reactive; requires numeraljs library
var elapsedSeconds = ExerciseClock.elapsedTime({format: '00:00:00'});
```

The `elapsedTime` function causes your computation to rerun on every 1-second tick.

## Contributing

Code contributions and fixes welcome by pull request.

[![Support via Gratipay](https://cdn.rawgit.com/gratipay/gratipay-badge/2.1.3/dist/gratipay.png)](https://gratipay.com/aldeed/)
