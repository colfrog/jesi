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
    if (i % 2 == 0) {
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
    let message = msgData.tail
      .split(" ")
      .slice(1)
      .join(" ");
    // only scan thru history if we have only 1 word on the line
    if (msgData.tailWords.length == 2) {
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        // check if it's the nick
        if (row.nick == msgData.tailWords[1]) {
          message = row.message;
          break;
        }
      }
    }
    ircWriter.sendMessage(msgData.replyTarget, mockMessage(message));
  });
}
addCommand("mock", "doMock");
