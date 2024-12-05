# mup-minio

Plugin for Meteor Up to setup and run Minio. Minio is run with `--appendonly yes` for persistance.

## Use

Install with `npm i -g mup-minio`.
Then, add to the `plugins` array in your mup config, and add a `minio` object.

```js
module.exports = {
  // rest of config

  plugins: ['mup-minio'],
  minio: {
    // Server to run minio on.
    servers: { one: {} },
    // Version of minio. Add '-alpine' to use a much smaller docker image
    version: '3.2.10-alpine',

    host: '127.0.0.1', // external minio host (optional) (default: 127.0.0.1) 
    port: 6379, // external minio port (optional) (default: 6379) 
  }
}
```

Next, run

```bash
mup setup
mup reconfig
```

Minio adds the environment variable `MINIO_URL` to the app. You cannot access minio from outside the server.

## Commands
- `mup minio setup`
- `mup minio start`
- `mup minio stop`
- `mup minio logs` View minio logs. Supports the same arguments as `mup logs`, including `--tail` and `--follow`.

## Minio Oplog
To use with [Minio Oplog](https://github.com/cult-of-coders/minio-oplog),
add the following configuration to your `settings.json`:
```json
{
  "minioOplog": {
    "minio": {
      "host": "minio",
      "port": 6379
    }
  }
}
```
