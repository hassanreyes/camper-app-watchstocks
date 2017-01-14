import React                    from "react";
import "moment";
import DatePicker               from 'react-datepicker'
import _                        from "underscore";
import CustomDatePickerComponent from "CustomDatePicker";

function getWindowFrom(to, zoom){
    var retVal = to.clone();
    
    switch(zoom){
        case '1M': retVal = retVal.subtract(1, 'months'); break;
        case '3M': retVal = retVal.subtract(3, 'months'); break;
        case '6M': retVal = retVal.subtract(6, 'months'); break;
        case '1Y': retVal = retVal.subtract(1, 'years'); break;
        case 'YTD': retVal = retVal.startOf('year'); break;
    }
    
    return retVal;
}

class ChartSettingsComponent extends React.Component {
    
    constructor(props){
        super(props);
        
        this.state = { from: props.from, to: props.to, zoom: props.zoom };
        
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.handleTimeSpan = this.handleTimeSpan.bind(this);
    }
    
    handleFromChange(from) {
        this.setState({ from: from });
        this.props.onChange( _.extend({}, this.state, { from: from }) );
    }
    
    handleToChange(to){
        this.setState({ to: to });
        this.props.onChange(  _.extend({}, this.state, { to: to }) );
    }
    
    handleTimeSpan(zoom){
        const from = getWindowFrom(this.state.to, zoom);
        this.setState({ from: from, zoom: zoom });
        this.props.onChange( _.extend({}, this.state, { from: from }) );
    }
    
    render(){
        
        return (
            <div className="row">
                <div className="col col-md-4">
                    <span><small>Zoom: </small></span>
                    <div className="btn-group">
                        <div className={"btn btn-sm btn-timespan " + (this.state.zoom === "1M" ? "active" : "")}
                            onClick={() => this.handleTimeSpan('1M')}>1M</div>
                        <div className={"btn btn-sm btn-timespan " + (this.state.zoom === "3M" ? "active" : "")}
                            onClick={() => this.handleTimeSpan('3M')}>3M</div>
                        <div className={"btn btn-sm btn-timespan " + (this.state.zoom === "6M" ? "active" : "")}
                            onClick={() => this.handleTimeSpan('6M')}>6M</div>
                        <div className={"btn btn-sm btn-timespan " + (this.state.zoom === "YTD" ? "active" : "")}
                            onClick={() => this.handleTimeSpan('YTD')}>YTD</div>
                        <div className={"btn btn-sm btn-timespan " + (this.state.zoom === "1Y" ? "active" : "")}
                            onClick={() => this.handleTimeSpan('1Y')}>1Y</div>
                    </div>
                </div>
                <div className="col col-md-2">
                    <h3 className="title">{this.props.title}</h3>
                </div>
                <div className="col col-md-6">
                    <div className="form-inline">
                      <div className="form-group">
                        <label htmlFor="exampleInputName2"><small>From&nbsp;</small></label>
                        <DatePicker
                            customInput={<CustomDatePickerComponent />}
                            selected={this.state.from}
                            onChange={this.handleFromChange}  />
                      </div>
                      &nbsp;&nbsp;
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail2"><small>To&nbsp;</small></label>
                        <DatePicker
                            customInput={<CustomDatePickerComponent />}
                            selected={this.state.to}
                            onChange={this.handleToChange} />
                      </div>
                    </div>
                </div>
            </div>
        );
    }
    
}

ChartSettingsComponent.propTypes = {
	from    : React.PropTypes.object.isRequired,
	to      : React.PropTypes.object.isRequired,
	zoom	: React.PropTypes.string.isRequired
};

export default ChartSettingsComponent;