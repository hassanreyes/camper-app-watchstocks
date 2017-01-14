import React        	from "react";
import ReStock      	from "react-stockcharts";
import { ChartCanvas, 
		Chart, 
		series, 
		scale,
		coordinates,
		tooltip,
		axes,
		indicator,
		helper }		from "react-stockcharts"
		
var dateFormat = d3.timeFormat("%A, %B %d, %Y");
var numberFormat = d3.format(".2f");
var yAxisFormat = d3.format(".2f");

var { LineSeries } = series;

var { discontinuousTimeScaleProvider } = scale;

var { CrossHairCursor, CurrentCoordinate,
        MouseCoordinateX, MouseCoordinateY } = coordinates;
        
var { HoverTooltip, MovingAverageTooltip } = tooltip;

var { XAxis, YAxis } = axes;

var { fitWidth, TypeChooser } = helper;

function tooltipContent(stocks) {
	return ({ currentItem, xAccessor }) => {
		
		let yValues = [];
		stocks.forEach((each) => {
			yValues.push({
				label: each.symbol,
				value: numberFormat(currentItem[each.symbol]),
				stroke: each.color
			});
		});
		
		return {
			x: dateFormat(xAccessor(currentItem)),
			y: yValues
		};
	};
}

class StocksChartComponent extends React.Component {
	
	constructor(props){
		super(props);
	}
    
    render(){
        var { stocks, data, width, ratio, window } = this.props;
        
        var margin = { left: 80, right: 80, top: 30, bottom: 50 };
        
        var width = 1200,
        	height = 400,
            ratio = 1,
            type = 'svg';
            
        var symbols = [...stocks.keys()];
        let _data = [];
        
    	for (let prop in data) {
    		let d = {};
    		$.extend(d, data[prop]);
    		d.date = new Date(d3.timeParse("%Y-%m-%dT%H:%M:%S.000Z")(d.date).getTime());
    		_data.push(d);
    	}
        	
        var gridHeight = height - margin.top - margin.bottom;
		var gridWidth = width - margin.left - margin.right;
        
        var showGrid = true;
		var yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.6 } : {};
		var xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 } : {};
		
		var xExtents = [ window.from, window.to ];
		
        if(_data.length > 0){
        	
        	var lines = [];
        	var coordinates = [];
        	
        	stocks.forEach((stock) => {
				lines.push(<LineSeries key={stock.symbol} yAccessor={(d) => { return d[stock.symbol]; }} 
					stroke={stock.color} strokeDasharray="Solid" strokeWidth={3} hoverStrokeWidth={4} />);
					
				coordinates.push(<CurrentCoordinate key={stock.symbol} yAccessor={(d) => { return d[stock.symbol]; }} fill={stock.color} />);
			});
        	
        	return (
		        <ChartCanvas ratio={ratio} height={400} width={width}
					margin={margin}
					type={type}
					seriesName="Stocks"
					data={_data} xExtents={xExtents} 
					xAccessor={d => d.date} 
					xScaleProvider={discontinuousTimeScaleProvider}>
					
					<Chart id={1}
							yExtents={d => symbols.map((each) => d[each] ) }
							padding={{ top: 10, bottom: 20 }}>
						<XAxis axisAt="bottom" orient="bottom" tickStroke="#AAA"
							fontFamily="'Teko', sans-serif"/>
		
						<YAxis axisAt="right" orient="right" ticks={5} {...yGrid} 
							tickStroke="#AAA" tickFormat={yAxisFormat} opacity={0.5}
							fontFamily="'Teko', sans-serif"/>
						
						{ lines }
						{ coordinates }
						
						<MouseCoordinateX
							at="bottom"
							orient="bottom"
							displayFormat={d3.timeFormat("%Y-%m-%d")} />
						
						<MouseCoordinateY
							at="right"
							orient="right"
							displayFormat={d3.format(".2f")} />
					</Chart>
					
					<HoverTooltip chartId={1} 
						yAccessor={(d) => { return d[symbols[0]] }}
						tooltipContent={tooltipContent(stocks)}
						fontSize={14} bgOpacity={0}
						fontFamily="'Teko', sans-serif"/>
					
					<CrossHairCursor stroke="#FFFFFF" />
				</ChartCanvas>
	    	);	
        }else{
        	return (<div className="well" style={{ padding: 5, height: 410, width: 1250 }}></div>);
        }
        
    }
}

StocksChartComponent.propTypes = {
    stocks  : React.PropTypes.object.isRequired,
	data    : React.PropTypes.array.isRequired,
	width   : React.PropTypes.number.isRequired,
	ratio   : React.PropTypes.number.isRequired,
	window	: React.PropTypes.object.isRequired
};

StocksChartComponent.defaultProps = {
	width: 800,
	ratio: 1
};

export default StocksChartComponent;

//var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

