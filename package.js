Package.describe({
  name: "aldeed:clock",
  version: "1.0.0",
  summary: "An accurate reactive clock",
  git: "https://github.com/aldeed/meteor-reactive-clock.git"
});

Package.onUse(function(api) {
  api.use('underscore@1.0.1', ['client']);
  api.use('tracker@1.0.3', ['client']);
  api.use('reload@1.1.1', ['client', 'server'], {weak: true});

  api.export('ReactiveClock');
  
  api.add_files(['clock.js'], 'client');
});