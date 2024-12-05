var joi = require('joi');

var schema = joi.object().keys({
  version: joi.string(),
  host: joi.string().optional(),
  port: joi.string().optional(),
  consolePort: joi.string().optional(),
  rootUser: joi.string().optional(),
  rootUserPassword: joi.string().optional(),
  servers: joi.object().keys().required()
});

module.exports = function(config, utils) {
  var details = [];

  var validationErrors = joi.validate(config.minio, schema, utils.VALIDATE_OPTIONS);
  details = utils.combineErrorDetails(details, validationErrors);
  details = utils.combineErrorDetails(
    details,
    utils.serversExist(config.servers, config.minio.servers)
  );

  return utils.addLocation(details, 'minio');
};
