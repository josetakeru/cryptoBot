// COMMAND FUNCTIONS
// Functions that are executed for each command


// Show PuercoinBot manual
function help() {

  var tg_text = "<b>#####       MANUAL       #####</b>\n\n" +
  
    "How do you do, fellow <i>humans</i>? I\'m " + botName +", your crypto-assistant.\n\n" +

    "Add a new <b>deposit</b> with:\n" +
    "   <code>\'/buy <i>COIN COST AMOUNT</i>\'</code> \n\n" +

    "Add a new <b>fee</b> with:\n" +
    "   <code>\'/fee <i>COIN COST</i>\'</code> \n\n" +

    "Check your <b>wallet</b> with: <code>\'/wallet\'</code>\n\n" +

    "Check a crypto with <code>\'/<i>COIN</i>\'</code>\n" +
    "(<i><b>COIN</b></i> must be: <i>btc</i>, <i>eth</i> or <i>ada</i>)";
   
    sendMessage(tg_text);
}


// Add new deposit in selected coin's sheet
function buy(tg_text) {

  if(tg_text.length != 4) {

    sendMessage("Invalid format");
    return

  }

  var current_date = getDate()
  var coin_id      = tg_text[1];
  var eur          = tg_text[2];
  var amount       = tg_text[3];
  var coin_eur     = (eur/amount).toFixed(2);
  var sheet_page   = sheet.getSheetByName(coin_id);
  var index        = glob_coin_id.indexOf(coin_id);

  if(isNaN(eur) || isNaN(amount)) sendMessage("Euros and amount must be numbers");

  else if(glob_coin_id.includes(coin_id)) { 

    sheet_page.appendRow([current_date, eur, amount, coin_eur]);
    res_text = "New deposit [" + current_date + "]:\n" +
      "<b>" + glob_coin_name[index] + ": </b>" + amount + coin_id.toUpperCase() + " for " + eur + "€ [" + coin_eur + "€ per "+ coin_id.toUpperCase() +"]";
  
    sendMessage(res_text);
  }
  else sendMessage("Don't gimme the <i>attitude</i>");
}


// Add fee in selected coin's sheet
function fee(tg_text) {

  if(tg_text.length != 3) {

    sendMessage("Invalid format");
    return

  }

  var current_date = getDate()
  var coin_id      = tg_text[1];
  var amount       = tg_text[2];
  var sheet_page   = sheet.getSheetByName(coin_id);
  var index        = glob_coin_id.indexOf(coin_id);

  if(isNaN(amount)) sendMessage("Euros and amount must be numbers");

  else if(glob_coin_id.includes(coin_id)) { 

    amount = amount*(-1)
    sheet_page.appendRow([current_date, "0", amount, "0"]);
    res_text = "New fee [" + current_date + "]:\n" +
      "<b>" + glob_coin_name[index] + ": </b>" + amount + coin_id.toUpperCase();
  
    sendMessage(res_text);
  }
  else sendMessage("Don't gimme the <i>attitude</i>");
}


// Gets the current price of a coin in the currency you choose
function getCoinPrice(coin, currency) {
  
  var coinPath  = coin + currency;

  if (coin == "XBT" || coin == "ETH") coinPath = 'X' + coin + 'Z' + currency; 

  var url       = 'https://api.kraken.com/0/public/Ticker?pair=' + coinPath;
  var result    = UrlFetchApp.fetch(url);
  var json      = JSON.parse(result.getContentText());
  var coinPrice = json["result"][coinPath]["a"][0];
  
  return Number(coinPrice).toFixed(2);
}


// Gets information of an specified crypto
function getCoinInfo(coin_id, portFolio){

  var index    = glob_coin_id.indexOf(coin_id);
  var coin_name = glob_coin_name[index]
  coin_id  = coin_id.toUpperCase()
  var cell     = index + 2;

  coin_id == 'BTC' ? coinPrice = getCoinPrice('XBT','EUR') : coinPrice = getCoinPrice(coin_id, 'EUR');
  coin_id == 'BTC' ? coinPrice_USD = getCoinPrice('XBT','USD') : coinPrice_USD = getCoinPrice(coin_id, 'USD');
  
  var coin          = sheet.getRange('Portfolio!B'+cell).getValue();
  var spent         = sheet.getRange('Portfolio!C'+cell).getValue();
  var coin_val      = coin * coinPrice;
  var profit        = coin_val - spent;

  if(portFolio) return [profit, coin_val];
  else {
    sendMessage("Retrieving " + coin_id + " info...");
    var res_text = "<b>#####       " + coin_name.toUpperCase() + "       #####</b>\n\n" +
      "<b>- Owned:</b> " + coin.toFixed(7) +"\n" +
      "<b>- Price:</b> " + coinPrice + "€" + " [$" + coinPrice_USD + "]\n" +
      "<b>- Spent:</b> " + spent.toFixed(2) + "€\n" +
        "<b>- Value:</b> " + coin_val.toFixed(2) + "€\n\n" + 
        "<b>PROFIT: " + profit.toFixed(2) + "€</b>";

    sendMessage(res_text);
  }
}


// Gets information of the portfolio
function getPortfolioInfo() {

  sendMessage("Retrieving wallet info...")

  var sheet_page   = sheet.getSheetByName('Portfolio');
  var coin = [], coin_prof = [], coin_val = [];
  var spent        = sheet_page.getRange('Portfolio!E2').getValue();
  var total_profit = 0;
  var aux_text = "";

  for (i = 0; i < glob_coin_name.length; i++) {

    sheet_page    = sheet.getSheetByName(glob_coin_id[i].toUpperCase());
    coin.push(sheet_page.getRange('Portfolio!B'+ (i + 2)).getValue());
    
    var aux = getCoinInfo(glob_coin_id[i], true);
    
    coin_prof.push(aux[0]);
    coin_val.push(aux[1]);

    total_profit += aux[0];

    aux_text = aux_text + 
      "<b>- " + glob_coin_id[i].toUpperCase() + ": </b> " + coin[i].toFixed(4) + " [" + coin_val[i].toFixed(2) + "€ ; " + coin_prof[i].toFixed(2) + "€]\n";

  }

  var current_value = total_profit + spent;
  var percentage_value = (100*current_value/spent)-100;
  var tg_text = "<b>#####       PORTFOLIO       #####</b>\n\n" +
    "<b>PROFIT: " + total_profit.toFixed(2) + "€  (" + percentage_value.toFixed(2) + "%) </b>\n\n" + aux_text +
    "\n<b>Spent: " + spent.toFixed(2) + "€ </b>\n" + 
    "<b>Value: " + current_value.toFixed(2) + "€</b>";

  sendMessage(tg_text);

  current_ath = sheet_page.getRange('Portfolio!F2').getValue();
  current_ath_eur = sheet_page.getRange('Portfolio!F3').getValue();
  current_ath_per = sheet_page.getRange('Portfolio!F4').getValue();

  if (current_value > current_ath) {

    var tg_text = "<b>#####       NEW ATH       #####</b>\n\n" +
      "<b>Old ATH: " + current_ath.toFixed(2) + "€ (" + current_ath_eur.toFixed(2) + "€) </b>\n" +
      "<b>New ATH: " + current_value.toFixed(2) + "€ (" + total_profit.toFixed(2) + "€) </b>\n\n";

    sendMessage(tg_text);

    sheet.getRange('Portfolio!F2').setValue(current_value.toFixed(2));

  }

}


// Gets personal All Time High
function ath() {

  var sheet_page  = sheet.getSheetByName('Portfolio');
  var current_ath = sheet_page.getRange('Portfolio!F2').getValue();
  var current_ath_eur = sheet_page.getRange('Portfolio!F3').getValue();
  var current_ath_per = sheet_page.getRange('Portfolio!F4').getValue();
  
  var tg_text = "<b>#####    CURRENT ATH    #####</b>\n\n" +
      "<b>Total value: " + current_ath.toFixed(2) + "€ </b>\n"+
      "<b>Total profit: " + current_ath_eur.toFixed(2) + "€ (" + (100*current_ath_per).toFixed(2) + "%) </b>\n";

  sendMessage(tg_text);
}


// Sends portfolio information
function hourlyNews() {
  getPortfolioInfo();
}