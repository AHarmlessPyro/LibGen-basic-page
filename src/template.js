import React from 'react';
// import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
// import './index.css';

class PageTemplate extends React.Component {

    /* INHERITED PROPS
        height:float
        leftComponent:Component/undefined
        rightComponent:Component/undefined
    */


    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <div className="primaryColor navBar" style={{ "height": this.props.height }}>
                {this.props.leftComponent}

                {this.props.rightComponent}
            </div>

        )
    }
}

export default PageTemplate;