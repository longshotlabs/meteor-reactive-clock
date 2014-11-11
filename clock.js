// Should make this a package
// Idea is to have an accurate clock timer that is reactive. Not just an interval ticker.

// unique name argument is necessary if you want to keep clock accurate after hot reload
ReactiveClock = function ReactiveClock(name) {
  var self = this;
  self._dependency = new Tracker.Dependency;
  self._intervalId = null;
  self._start = null;
  self._previousElapsed = 0;
  self._elapsed = 0;
  self._stopped = true;

  // retain elapsed time on hot code push
  if (name && Package.reload) {
    var Reload = Package.reload.Reload;
    
    Reload._onMigrate("ReactiveClock_" + name, function () {
      return [true, {
        _start: self._start,
        _previousElapsed: self._previousElapsed,
        _elapsed: self._elapsed,
        _stopped: self._stopped
      }];
    });

    var data = Reload._migrationData("ReactiveClock_" + name);
    if (data) {
      _.extend(self, data);
      if (data._stopped === false) {
        self._setInterval();
      }
    }
    
  }
};

ReactiveClock.prototype._setInterval = function () {
  var self = this;

  self._intervalId = Meteor.setInterval(function() {
    var diff = getNow() - self._start;
    var secs = Math.floor(diff / 1000);
    self._elapsed = self._previousElapsed + secs;
    self._dependency.changed();
  }, 1000);
};

ReactiveClock.prototype.start = function () {
  var self = this;

  if (!self._stopped)
    return;

  if (!self._start) {
    self._elapsed = 0;
    self._dependency.changed();
  }

  // we reset start time every time, but if this is a "resume",
  // then self._previousElapsed will be non-zero and will be added
  self._start = getNow();  

  self._setInterval();

  self._stopped = false;
};

ReactiveClock.prototype.stop = function () {
  var self = this;
  Meteor.clearInterval(self._intervalId);
  self._intervalId = null;
  self._previousElapsed = self._elapsed;
  self._stopped = true;
};

ReactiveClock.prototype.setElapsedSeconds = function (elapsed) {
  var self = this;
  elapsed = elapsed || 0;
  self._start = getNow() - (elapsed * 1000);
  self._previousElapsed = 0;
  self._elapsed = elapsed;
  self._dependency.changed();
};

ReactiveClock.prototype.elapsedTime = function (options) {
  var self = this;
  options = options || {};
  self._dependency.depend();
  if (options.format) {
    if (typeof numeral !== "function") {
      throw new Error("ReactiveClock.elapsedTime requires the `numeral` variable in scope when you pass a format string. Add a numeraljs package or library to your app.");
    }
    return numeral(self._elapsed).format(options.format);
  } else if (options.humanize) {
    if (typeof moment !== "function") {
      throw new Error("ReactiveClock.elapsedTime requires the `moment` variable in scope when you set humanize option to true. Add a momentjs package or library to your app.");
    }
    return moment.duration(self._elapsed, 'seconds').humanize(options.suffix || false);
  } else {
    return self._elapsed;
  }
};

function getNow() {
  return (new Date()).getTime();
}
