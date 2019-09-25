var path = require('path');
var fs = require('fs');
var util = require('util');
var hfc = require('fabric-client');
var helper = require('./helper.js');
var logger = helper.getLogger('Query');


// first setup the client for this org
const org_name = 'Org1';
const username = 'user1';
const channelName = 'mychannel';
const chaincodeName = 'qrneo';

var client = await helper.getClientForOrg(org_name, username);
logger.debug('Successfully got the fabric client for the organization "%s"', org_name);
var channel = client.getChannel(channelName);
if (!channel) {
    let message = util.format('Channel %s was not defined in the connection profile', channelName);
    logger.error(message);
    throw new Error(message);
} else {
    console.log(channel);
}

		// send query
		// var request = {
		// 	targets : [peer], //queryByChaincode allows for multiple targets
		// 	chaincodeId: chaincodeName,
		// 	fcn: fcn,
		// 	args: args
		// };
		// let response_payloads = await channel.queryByChaincode(request);
		// if (response_payloads) {
		// 	for (let i = 0; i < response_payloads.length; i++) {
		// 		logger.info(args[0]+' now has ' + response_payloads[i].toString('utf8') +
		// 			' after the move');
		// 	}
		// 	return args[0]+' now has ' + response_payloads[0].toString('utf8') +
		// 		' after the move';
		// } else {
		// 	logger.error('response_payloads is null');
		// 	return 'response_payloads is null';
		// }
