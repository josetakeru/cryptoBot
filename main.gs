// MAIN     
// Code that is executed whenever the bot is called via command


// Reads incoming commands from chat
function doPost(tg_msg) {

  // Process Telegram message
  var tg_text = cleanMsg(tg_msg);

  // Command "/COIN": Retrieve COIN information
  if (glob_coin_id.includes(tg_text[0])) getCoinInfo(tg_text[0], false);

  // Command "/wallet": Retrieve portfolio information
  else if (tg_text[0] == "wallet") getPortfolioInfo();

  // Command "/buy": Buy a coin
  else if (tg_text[0] == "buy") buy(tg_text);

  // Command "/fee": Add coin transaction fee
  else if (tg_text[0] == "fee") fee(tg_text);

  // Command "/ath": Gets current ATH value
  else if (tg_text[0] == "ath") ath(tg_text);

  // Command "/help": Show cryptoBot manual
  else if (tg_text[0] == "help") help();

  // Unknown or invalid command
  else sendMessage("Invalid command");

}