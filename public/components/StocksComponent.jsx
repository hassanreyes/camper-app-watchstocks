import React                    from "react";
import io                       from "socket.io-client";
import moment                   from "moment";
import _                        from "underscore";

import StockInfoComponent       from "StockInfo";
import NewStockComponent        from "NewStock";
import ChartSettingsComponent   from "ChartSettings";
import StocksChartComponent     from "StocksChart";

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getWindowFrom(to, zoom){
    var retVal = to.clone();
    
    console.log(retVal);
    switch(zoom){
        case '1M': retVal.subtract(1, 'months'); break;
        case '3M': retVal.subtract(3, 'months'); break;
        case '6M': retVal.subtract(6, 'months'); break;
        case '1Y': retVal.subtract(1, 'years'); break;
        case 'YTD': retVal.startOf('year'); break;
    }
    console.log(retVal);
    
    return retVal;
}

class StocksComponent extends React.Component {
    
    constructor(props){
        super(props);    
        
        const host = location.origin.replace(/^http/, 'ws');
        this.state = {  stocks          : new Map(), 
                        socket          : io.connect(host), 
                        newStockError   : null, 
                        period          : { 
                            from        : moment().subtract(1, 'months'),
                            to          : moment()
                        },
                        window          : {
                            from        : moment().subtract(1, 'months'),
                            to          : moment()
                        },
                        zoom            : '1M',
                        data            : [] 
                        /*
                        * data :
                        * [ 
                        *   Date1: {
                        *       date: Date1,
                        *       SYMBOL1 : Close value,
                        *       SYMBOL2 : Close value,
                        *       ...
                        *   },
                        *   Date2: {
                        *       date: Date2,
                        *       SYMBOL1 : Close value,
                        *       SYMBOL2 : Close value,
                        *       ...
                        *   }
                        * ]
                        */
        };
        
        this.handleNewSymbol = this.handleNewSymbol.bind(this);
        this.handleRemoveStock  = this.handleRemoveStock.bind(this);
        this.handleChangeSettings = this.handleChangeSettings.bind(this);
        this.handleZoomchanged = this.handleZoomchanged.bind(this);
        
        this.fetchData();
    }
    
    fetchData() {
        // Handle when a stock is added from any client, data has the stock information
        this.state.socket.on('stock-added', (data) => {
            data = _.extend(data, { color: getRandomColor() });
            console.log(JSON.stringify(data));
            
            this.setState( 
                { 
                    stocks : this.state.stocks.set( 
                        data.symbol, 
                        data
                    ),
                    newStockError: null
                });
                
            // Request for historical data of the recentlly added stock
            this.state.socket.emit("historical", { symbol: data.symbol, period: this.state.period });
        });
        
        // Handle when some client (this included) removes a stock
        this.state.socket.on('stock-removed', (stock) => {
           console.log("stock removed: " + JSON.stringify(stock));
           
           // Remove from the local map
           if(this.state.stocks.delete(stock.symbol)){
                this.setState( { stocks : this.state.stocks } );
            }
        });
        
        // Handle when a new stock was not found by the given symbol (this is peer to peer response)
        this.state.socket.on('not-found', (data) => {
            console.log("not found " + data.symbol);
            this.setState( { newStockError: `Stock ${data.symbol} not found` });
        });
        
        this.state.socket.on('hist-not-found', (data) => {
            console.log("hist not found " + data.symbol);
            this.setState( { newStockError: `Stock ${data.symbol} historical data not found` });
        });
        
        // Handle the retrived historical data for a single symbol (this is peer to peer response)
        this.state.socket.on('historical', (data) => {
            
            console.log(data);
            
            var localData = this.state.data; 
            data.forEach((item) => {
                if(!localData[item.date]){
                    localData[item.date] = { date: item.date };
                }
                
                localData[item.date][item.symbol] = item.close;
            });
            
            this.setState({ data: localData });
        });
    }
    
    handleNewSymbol(symbol){
        // Send an add-stock message
       this.state.socket.emit("add-stock", { symbol: symbol });
    }
    
    handleRemoveStock(stock){
        console.log("removing stock: " + stock.symbol);
        // Send a remove-stock message with the symbol of the stock
        this.state.socket.emit("remove-stock", stock.symbol);
    }
    
    handleChangeSettings(settings){
        
        let period = { from: settings.from, to: settings.to };
        
        this.setState({ period: period, data: [] });
        
        // Request for historical data of all stocks
        this.state.stocks.forEach((stock) => {
            this.state.socket.emit("historical", { symbol: stock.symbol, period: period }); 
        });
    }
    
    handleZoomchanged(zoom){
        
        const period = { from: getWindowFrom(this.state.period.to, zoom), to: this.state.period.to };
        
        this.setState({ period: period });
    }
    
    componentDidMount() {
    }
    
    renderStock(stock){
        return ( <StockInfoComponent stock={stock} onRemove={this.handleRemoveStock} key={stock.symbol}/> );
    }
    
    render() {
        
        let stockElements = [];
        if(this.state.stocks){
            this.state.stocks.forEach(s => stockElements.push(this.renderStock(s)));
        }
        
        return (
            <div className="container" style={{ topMargin: 20 }}>
                <div className="row">
                    <div className="chart-well" >
                        <ChartSettingsComponent title="Stocks" onChange={this.handleChangeSettings} onZoomChanged={this.handleZoomchanged}
                                from={this.state.period.from} to={this.state.period.to} zoom={this.state.zoom}/>
                        <StocksChartComponent data={this.state.data} stocks={this.state.stocks} window={this.state.window}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <NewStockComponent onNewSymbol={this.handleNewSymbol} error={this.state.newStockError} ref="newStock"/>
                        <hr/>
                        <div className="inline-flex-stocks">
                            { stockElements }
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default StocksComponent;