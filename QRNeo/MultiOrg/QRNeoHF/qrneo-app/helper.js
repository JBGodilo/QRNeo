'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('Helper');
//logger.setLevel('DEBUG');
logger.setLevel = 'DEBUG';

var path = require('path');
var util = require('util');
var copService = require('fabric-ca-client');

var hfc = require('fabric-client');
hfc.setLogger(logger);
var ORGS = hfc.getConfigSetting('network-config');

var clients = {};
var channels = {};
var caClients = {};

var sleep = async function (sleep_time_ms) {
	return new Promise(resolve => setTimeout(resolve, sleep_time_ms));
}

var getLogger = function(moduleName) {
	var logger = log4js.getLogger(moduleName);
//    logger.setLevel('DEBUG');
    logger.setLevel = 'DEBUG';
	return logger;
};

async function getClientForOrg (userorg, username) {
	logger.debug('getClientForOrg - ****** START %s %s', userorg, username)
	// get a fabric client loaded with a connection profile for this org
	let config = '-connection-profile-path';

	// build a client context and load it with a connection profile
	// lets only load the network settings and save the client for later
	let client = hfc.loadFromConfig(hfc.getConfigSetting('network'+config));

	// This will load a connection profile over the top of the current one one
	// since the first one did not have a client section and the following one does
	// nothing will actually be replaced.
	// This will also set an admin identity because the organization defined in the
	// client section has one defined
	client.loadFromConfig(hfc.getConfigSetting(userorg+config));

	// this will create both the state store and the crypto store based
	// on the settings in the client section of the connection profile
	await client.initCredentialStores();

	// The getUserContext call tries to get the user from persistence.
	// If the user has been saved to persistence then that means the user has
	// been registered and enrolled. If the user is found in persistence
	// the call will then assign the user to the client object.
	if(username) {
		let user = await client.getUserContext(username, true);
		if(!user) {
			throw new Error(util.format('User was not found :', username));
		} else {
			logger.debug('User %s was found to be registered and enrolled', username);
		}
	}
	logger.debug('getClientForOrg - ****** END %s %s \n\n', userorg, username)

	return client;
}

exports.getLogger = getLogger;
exports.getClientForOrg = getClientForOrg;