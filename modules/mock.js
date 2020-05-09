var jModule = {
  name: "mock",
  description: "Mocks the given message",
  permissions: {
    hasServerInfo: true,
    hasIRCWriter: true,
    hasLogAccess: true
  }
};

function mockMessage(message) {
  let response = "";
  for (let i = 0; i < message.length; i++) {
    if (Math.floor(Math.random()*2) == 0) {
      response += message[i].toUpperCase();
    } else {
      response += message[i].toLowerCase();
    }
  }
  return response;
}

function doMock(msgData) {
  // scan through last 30 messages of current channel
  getLogs(msgData.replyTarget, 30, (err, rows) => {
    if (err) return;
    let target = msgData.nick;
    let message = msgData.tail
      .split(" ")
      .slice(1)
      .join(" ");

    // Send the previous message when there is only %mock
    if (msgData.tailWords.length == 1) {
      target = rows[0].nick;
      message = rows[0].message;
    // only scan thru history if we have only 1 word on the line
    } else if (msgData.tailWords.length == 2) {
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        // check if it's the nick
        if (row.nick == msgData.tailWords[1]) {
          target = row.nick;
          message = row.message;
          break;
        }
      }
    }

    ircWriter.sendMessage(msgData.replyTarget, '<\x02' + target + '\x02> ' + mockMessage(message));
  });
}

addCommand("mock", "doMock");
