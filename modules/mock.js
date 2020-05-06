var jModule = {
  name: "mock",
  description: "Mocks the given message",
  permissions: {
    hasServerInfo: true,
    hasIRCWriter: true
  }
};

function doMock(msgData) {
  // gEt rId oF cOmMaNd
  let text = msgData.tail.split(" ").slice(1).join(" ");
  let response = "";

  for (let i = 0; i < text.length; i++) {
    if (i % 2 == 0) {
      response += text[i].toUpperCase();
    } else {
      response += text[i];
    }
  }

  ircWriter.sendMessage(msgData.replyTarget, response);
}

addCommand("mock", "doMock");
