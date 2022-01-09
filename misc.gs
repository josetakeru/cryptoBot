//     ==========     OTHER FUNCTIONS     ==========     \\


// Sends message to chat in HTML format
function sendMessage(tg_text) {

  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(tg_chatId),
      text: tg_text,
      parse_mode: "HTML"
    }
  }

  UrlFetchApp.fetch(tg_url, data);
}


// Returns current date in dd.MM.yy format
function getDate() {

  var current_date = new Date;
  return formatted_date = Utilities.formatDate(current_date, 'Europe/Madrid', 'dd.MM.yy');
}


// Sets bot commands
function setCommand(){

  var commands = [
    {
      "command": "help",
      "description": "Greet " + botName + " and see what it can do."
    },
    {
      "command": "ath",
      "description": "Gets current recorded ATH."
    },
    {
      "command": "buy",
      "description": "Buy crypto [i.e. \'/buy <i>COIN COST AMOUNT</i>\'."
    },
    {
      "command": "wallet",
      "description": "Show portfolio."
    },
    {
      "command": "fee",
      "description": "Add crypto transaction fee."
    },
    {
      "command": "ada",
      "description": "Show info on owned Cardano."
    },
    {
      "command": "btc",
      "description": "Show info on owned Bitcoin."
    },
    {
      "command": "eth",
      "description": "Show info on owned Ethereum."
    },
  ];

  var data = {
    method: "post",
    payload: {
      method: "setMyCommands",
      parse_mode: "HTML",
      commands: JSON.stringify(commands)
    }
  }
  var response=  UrlFetchApp.fetch(tg_url, data);
  Logger.log(response)
}


// Processes the incoming Telegram message
function cleanMsg(tg_msg) {

  var tg_json = JSON.parse(tg_msg.postData.contents);
  var tg_text = tg_json.message.text.toLowerCase().split(" ");

  // Remove / character from command
  tg_text[0] = tg_text[0].replace('/','');

  // If included, remove @botName from command
  if (tg_text[0].includes("@" + botName.toLowerCase())) tg_text[0] = tg_text[0].replace('@'+botName.toLowerCase(),'');

  return tg_text;
}