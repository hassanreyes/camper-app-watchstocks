var async = require('async');
var moment = require("moment");
var yahooFinance = require('yahoo-finance');

var sockets = [];
var stocks = [];

var handler = function(socket) {
    
    /* -------------------------
    * New connection
    * -------------------------*/
    console.log("connected: " + socket);
    sockets.push(socket);
    // Send added stocks
    stocks.forEach(function (stock) {
      socket.emit('stock-added', stock);
    });
    
    /* -------------------
     * Socket disconnected
     * -------------------*/
    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
    });
    
    /* ---------------------
     * New Stock requested
     * ---------------------*/
    socket.on('add-stock', (data) => {
      
      console.log("add-stock: " + data.symbol);
      
      var symbol = String(data.symbol || '');

      if (!symbol)
        return;

      //Check if stock was already requested  
      var stock = stocks.find(s => s.symbol === symbol);
      
      //If was not requested before, request now
      if(!stock){
        yahooFinance.snapshot({
            symbol: symbol,
            fields: ['s', 'n', 'i', 'n4', 'd1', 'l1', 'y', 'r', 'j1', 'j3', 'x', 't7', 't6'],
        }, function (err, snapshot) {
            if(err) { console.error(err); }
            
            if(!snapshot.name){
              return socket.emit("not-found", data);
            }
            
            console.log(JSON.stringify(snapshot));
            stock = { symbol: snapshot.symbol, name: snapshot.name, desc: snapshot.moreInfo };
            
            broadcast('stock-added', stock);
            stocks.push(stock); 
        });
      }
      else{
        console.log("Stock already exist");
      }
      
    });
    
    /* ------------------------------
     * Remove a stock from collection 
     * ------------------------------*/
    socket.on('remove-stock', (syl) => {
      var symbol = String(syl || '');

      if (!symbol)
        return;
        
      //Check if stock was already requested  
      var stock = stocks.find(s => s.symbol === symbol);
      
      //If was not requested before, request now
      if(stock){
          stocks.splice(stocks.indexOf(stock), 1);
          broadcast('stock-removed', stock);
      }
    });

    /* ---------------------------------
     *  Request for Historical data of a single stock
     * ---------------------------------*/
    socket.on('historical', (params) => {
      
      console.log("historical: " + JSON.stringify(params));
      
      if(params){
        //var _from = params.period.from.diff(params.period.to) > 0 ? params.period.to : params.period.from;
        //var _to = params.period.from.diff(params.period.to) < 0 ? params.period.from : params.period.to;
      
        yahooFinance.historical({
            symbol  : params.symbol,
            from    : params.period.from,
            to      : params.period.to
        }, function (err, hist) {
            if(err) { console.error(err); }

            if(!hist || hist.length === 0){
              return socket.emit("hist-not-found", { symbol: params.symbol});
            }
            
            //respond with historical data
            socket.emit('historical', hist);
        });
      }
    });
};

/* -----------------------------
 * Broadcast data to all sockets
 * -----------------------------*/
function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
};

module.exports = handler;