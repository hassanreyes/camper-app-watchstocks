import React from "react";

class StockInfoComponent extends React.Component {
    
    constructor(props){
        super(props);
        this.state = { stock: props.stock };
        
        this.handleRemove = this.handleRemove.bind(this);
    }
    
    handleRemove(e){
        this.props.onRemove(this.state.stock);
    }

    render() {
        
        return (
            <div className="thumbnail inline-stock" style={ { color: this.state.stock.color } }>
              <div className="caption">
                <button type="button" className="close" aria-label="Close" onClick={this.handleRemove}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <h3>{this.state.stock.symbol}</h3>
                <p>{this.state.stock.name} Prices, Dividends, Splits and Trading Volume</p>
              </div>
            </div>
        );
    }
}

export default StockInfoComponent;