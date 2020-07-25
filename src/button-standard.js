import React from 'react'

class ButtonCustom extends React.Component {
    render() {
        return (
            <button
                className={`${this.props.classes} basicButton basicButton border`}
                onClick={this.props.onClickFunction}
                style={this.props.style}>
                {this.props.children}
            </button>)
    }
} export default ButtonCustom;