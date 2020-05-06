var jModule = {
  name: "8ball",
  description: "Replica Magic 8 Ball",
  permissions: {
    hasIRCWriter: true
  }
};

let answers = [
  // yes
  [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes -- definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes"
  ],
  // again
  [
    "Reply hazy, try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again"
  ],
  //no
  [
    "Dont count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful",
    "NOOOOO WAY"
  ]
];

function do8ball(msgData) {
  let bankNumber = Math.floor(Math.random() * answers.length);
  let answer =
    answers[bankNumber][Math.floor(Math.random() * answers[bankNumber].length)];
  ircWriter.sendMessage(msgData.replyTarget, answer);
}

addCommand("8ball", "do8ball");
