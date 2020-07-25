import React from 'react';

class ResultsPage extends React.Component {

    render() {
        return (
            <div className="resultsContainer">
                {this.props.childrenm}
            </div>
        );
    }
} export default ResultsPage;