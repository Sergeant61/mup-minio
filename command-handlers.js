module.exports = {
  setup: function(api, nodemiral) {
    if (!api.getConfig().minio) {
      console.log(
        'Not setting up minio since there is no minio config'
      );
      return;
    }

    var minioSessions = api.getSessions(['minio']);
    var appSessions = api.getSessions(['app']);
    var minioConfig = api.getConfig().minio;

    if (appSessions.length !== 1) {
      console.log(
        'To use built-in minio setup, you have to have only one meteor server'
      );
      return;
    } else if (minioSessions[0]._host !== appSessions[0]._host) {
      console.log(
        'To use built-in minio setup, both the meteor app and minio db need to be on the same server'
      );
      return;
    }

    var list = nodemiral.taskList('Setup Minio');

    list.executeScript('Setup Environment', {
      script: api.resolvePath(__dirname, 'assets/minio-setup.sh'),
      vars: {
        minioVersion: minioConfig.version || 'latest',
        minioDir: '~/minio',
        minioHost: minioConfig.host || '127.0.0.1',
        minioPort: minioConfig.port || '9000',
        minioConsolePort: minioConfig.consolePort || '9001',
        minioRootUser: minioConfig.rootUser || 'ROOT_USER',
        minioRootPassword: minioConfig.rootUserPassword || 'ROOT_PASSWORD',
      }
    });

    return api.runTaskList(list, appSessions, { verbose: api.getVerbose() });
  },
  logs: function(api) {
    var args = api.getArgs();
    var sessions = api.getSessions(['minio']);

    // remove minio from args sent to docker
    args.shift();

    return api.getDockerLogs('minio', sessions, args);
  },
  start: function(api, nodemiral) {
    var list = nodemiral.taskList('Start Minio');
    var sessions = api.getSessions(['minio']);
    var config = api.getConfig().minio;

    list.executeScript('Start Minio', {
      script: api.resolvePath(__dirname, 'assets/minio-start.sh'),
      vars: {
        minioVersion: config.version || 'latest',
        minioDir: '~/minio',
        minioHost: config.host || '127.0.0.1',
        minioPort: config.port || '9000',
        minioConsolePort: config.consolePort || '9001',
        minioRootUser: config.rootUser || 'ROOT_USER',
        minioRootPassword: config.rootUserPassword || 'ROOT_PASSWORD',
      }
    });

    return api.runTaskList(list, sessions, { verbose: api.getVerbose() });
  },
  stop: function(api, nodemiral) {
    var sessions = api.getSessions(['minio']);
    var list = nodemiral.taskList('Stop Minio');
    
    list.executeScript('Stop Minio', {
      script: api.resolvePath(__dirname, 'assets/minio-stop.sh')
    });

    return api.runTaskList(list, sessions, { verbose: api.getVerbose() });
  }
};
