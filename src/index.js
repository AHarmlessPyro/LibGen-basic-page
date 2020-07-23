import React from 'react';
import ReactDOM from 'react-dom';
import PageTemplate from './template'
import LoginPage from './login'
import ResultsPage  from './resultsPage'


require('./index.css');

const LC = () => {
    return <span className="primaryColor">YOLO</span>
}

class App extends React.Component {
    constructor(props) {
        super(props);

        let displayLogin = false;
        let cookieItems = document.cookie.split(';')
        cookieItems.forEach((item) => {
            if (item.includes('user')) {
                displayLogin = true;
            }
        });

        this.state = {
            navHeight: '6vh',
            loginSuccess: displayLogin
        }
    }

    onLogin(userName) {
        let expiry = new Date();
        expiry.setTime(expiry.getTime() + (60 * 60 * 1000)); // current time + 1 hour in ms                

        document.cookie = `user=${userName}; expires=${expiry.toUTCString()}`;
        this.setState({ loginSuccess: true });
    }

    onLogout() {
        document.cookie = `user=""; expires=${new Date(0)}`;
        this.setState({ loginSuccess: false });
    }

    render() {

        var internalComponent;

        if (!this.state.loginSuccess) {
            // login
            return (
                <div style={{ display: "grid" }}>
                    <PageTemplate height={this.state.navHeight} style={{ marginBottom: "10px" }}></PageTemplate> {/*leftComponent="YOLO"*/}
                    <div className="loginContainer" style={{ top: this.state.navHeight }}>
                        <LoginPage loginSuccess={this.state.loginSuccess} successFunc={this.onLogin.bind(this)}>

                        </LoginPage>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <PageTemplate height={this.state.navHeight} style={{ marginBottom: "10px" }}></PageTemplate> {/*leftComponent="YOLO"*/}
                    <ResultsPage></ResultsPage>
                    <span>NYAAAA!</span>
                    <button onClick={this.onLogout.bind(this)}>Delete Cookie</button>
                </div>
            )
        }
    }
}

ReactDOM.render(<App />, document.getElementById('app'))