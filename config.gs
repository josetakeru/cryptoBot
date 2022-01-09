// TELEGRAM VARIABLES

// Get from Telegram Bot e.g. https://api.telegram.org/bot1234567890:abcdefgABCDEFG/";
var tg_url    = "<YOUR_TELEGRAM_BOT_URL>"; <--- CHANGE ME!
// Get from Telegram e.g. 012345678";
var tg_chatId = "<YOUR_TELEGRAM_BOT_CHAT_ID>"; <--- CHANGE ME!
// Get from Google Sheet URL e.g. https://docs.google.com/spreadsheets/d/SHEET_ID/
var botName   = "<YOUR_TELEGRAM_BOT_NAME>"; <--- CHANGE ME!


// GOOGLE SHEET VARIABLES

// Get from Google Sheet URL e.g. https://docs.google.com/spreadsheets/d/SHEET_ID/
var sheet_ID  = "<MY_GOOGLE_SHEET_ID>"; <--- CHANGE ME!
var sheet     = SpreadsheetApp.openById(sheet_ID);


// COIN VARIABLES

var glob_coin_id   = ["btc", "eth", "ada"];
var glob_coin_name = ["Bitcoin", "Ethereum", "Cardano"];