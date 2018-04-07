var cmds = [cmdAtWarGenerals];
var HTTPS  = require('https');
var mods = require('../modules/mods.js');

//exports
exports.modName = "At War Generals";

exports.checkCommands = function(dataHash, callback) {
  for (cmd in cmds) {
    var test = cmds[cmd](dataHash.request, dataHash.bots, dataHash.isMod, dataHash.owner, callback);
    if (test)
      return test;
  }
}

exports.getCmdListDescription = function () {
  cmdArr = [
    {cmd: "@wargenerals", desc: "Pings all war generals in the current room.", mod: true}
  ];

  return cmdArr;
}

function cmdAtWarGenerals(request, bots, isMod, owner, callback) {
  var regex = /@wargenerals/i;
  var reqText = request.text;

  if (regex.test(reqText)){
    var val = regex.exec(reqText);

    if (!owner.access_token)
      return;

    getUserIDs(owner.access_token, request.group_id, function(userIDs, msg){
      var attachments = [{
        "loci": [],
        "type": "mentions",
        "user_ids": []
      }];

      var loci = [];
      var user = [];

      for(user in userIDS){
        if (mods.isMod(userIDs[user])) {
          attachments[0]["loci"].push([24, request.name.length]);
          attachments[0]["user_ids"].push(userIDs[user]);
        }
      }

      var msg = "Hey war generals! " + request.name + " needs assistance!";
      callback(true, msg, attachments);
    });

    return msg;
  }
}

function getUserIDs(ownerID, groupID, apiCallback) {
  var options = {
    hostname: 'api.groupme.com',
    path: '/v3/groups?token=' + ownerID
  };

  callback = function(response) {
    str = '';

    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      str = JSON.parse(str);
      msg = str;
      for (room in msg.response) {
        if (msg.response[room].id == groupID){
          var userIdArr = []
          for(user in msg.response[room].members){
            userIdArr.push(msg.response[room].members[user].user_id);
          }
          apiCallback(userIdArr);
        }
      }
    });
  };

  HTTPS.request(options, callback).end();
}