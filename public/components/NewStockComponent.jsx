import React from "react";

class NewStockComponent extends React.Component {
    
    constructor(props){
        super(props);
        
        this.state = { error: null }
        
        this.handleNewSymbol = this.handleNewSymbol.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    }
    
    
    handleNewSymbol(e){
        e.preventDefault();
        this.props.onNewSymbol(this.refs.newName.value);
        this.refs.newName.value = "";
    }
    
    componentWillReceiveProps(newProps){
        this.setState( { error: newProps.error });
    }
    
    render(){
        
        return (
            <div className="form-group custom">
            <form onSubmit={this.handleNewSymbol}>
                <label htmlFor="new-name">Syncs in realtime across clients</label>
                <div className="input-group">
                    <input type="text" className="form-control" id="new-name" placeholder="Enter Stock Symbol..." ref="newName"/>
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="submit">Add</button>
                    </span>
                </div>
                <p className="bg-warning"><small>{this.state.error}</small></p>
            </form>
            </div>
        );
    }
}

export default NewStockComponent;