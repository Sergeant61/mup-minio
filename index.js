var commandHandlers = require('./command-handlers');
var validate = require('./validate');

module.exports = {
  name: 'minio',
  description: 'Commands to setup and manage Minio',
  commands: {
    setup: {
      description: 'Installs and starts Minio',
      handler: commandHandlers.setup
    },
    logs: {
      description: 'View Minio logs',
      builder: function(yargs) {
        return yargs.strict(false);
      },
      handler: commandHandlers.logs
    },
    start: {
      description: 'Start Minio',
      handler: commandHandlers.start
    },
    stop: {
      description: 'Stop Minio',
      handler: commandHandlers.stop
    }
  },
  validate: {
    minio: validate
  },
  prepareConfig: function(config) {
    if (config.app && config.minio) {
      if (!config.app.docker) {
        config.app.docker = {};
      }
      if (!config.app.docker.args) {
        config.app.docker.args = [];
      }
    }
  },
  hooks: {
    'post.setup': function(api) {
      if (!api.getConfig().minio) {
        return;
      }

      return api.runCommand('minio.setup')
        .then(function() {
          return api.runCommand('minio.start');
        });
    }
  }
};
