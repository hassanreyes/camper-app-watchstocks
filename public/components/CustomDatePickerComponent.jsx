import React        from "react";

class CustomDatePickerComponent extends React.Component {
    render () {
        return (
            <button
                className="custom-datepicker"
                onClick={this.props.onClick}>
                {this.props.value}
            </button>
        )
    }
}

CustomDatePickerComponent.propTypes = {
    onClick: React.PropTypes.func,
    value: React.PropTypes.string
};

export default CustomDatePickerComponent;