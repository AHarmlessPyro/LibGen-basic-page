import React from 'react';
import ReactDOM from 'react-dom';
import PageTemplate from './template'
import LoginPage from './login'
import ButtonCustom from './button-standard'
import GenericDisplay from './genericDisplay'

// import SearchBar from './SearchBar'

import LogoIcon from './Logo.png'
import LogoIconAlt from './LogoAlt.png'

require('./index.css');

const HeaderComponent = () => {
    return (
        <span className="primaryColor" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}> Libgen Library</span>
    )
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
            loginSuccess: displayLogin,
            currentMode: "Arrivals",
            rerender: false,
        }

        this.modes = ['Collections', 'Explore', 'Arrivals'];
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

    setMode(mode, evt) {
        if (this.modes.includes(mode)) {
            this.setState({
                currentMode: mode,
                rerender: true
            })
        }
    }

    setRenderingStatus(truth) {
        this.setState({
            rerender: truth
        });
    }

    render() {
        if (!this.state.loginSuccess) {
            // login
            return (
                <div style={{ display: "grid" }}>
                    <PageTemplate
                        height={this.state.navHeight}
                        style={{ marginBottom: "10px" }}
                        centerComponent={<HeaderComponent></HeaderComponent>}>
                    </PageTemplate>
                    <div
                        className="loginContainer"
                        style={{ top: this.state.navHeight }}>
                        <img
                            className="logoImgFull"
                            src={LogoIconAlt}>
                        </img>
                        <LoginPage
                            loginSuccess={this.state.loginSuccess}
                            successFunc={this.onLogin.bind(this)}
                            failFunc={this.onLogout.bind(this)}>
                        </LoginPage>
                    </div>
                </div >
            )
        } else {
            return (
                <div>
                    <PageTemplate
                        height={this.state.navHeight}
                        style={{ marginBottom: "10px" }}
                        leftComponent={<div></div>}
                        centerComponent={<HeaderComponent></HeaderComponent>}
                        rightComponent={
                            <ButtonCustom
                                classes="primaryOppositeColor"
                                onClickFunction={this.onLogout.bind(this)}
                            >
                                logout
                            </ButtonCustom>}
                    >
                    </PageTemplate>
                    <div
                        className="resultsContainer">
                        <div
                            style={{ display: "grid" }}
                            className="viewChoice">

                            <ButtonCustom
                                classes="collectionsButton choiceButton primaryColor"
                                onClickFunction={(evt) => { this.setMode('Collections', evt) }}
                            >
                                Collections
                            </ButtonCustom>

                            <ButtonCustom
                                classes="exploreButton choiceButton primaryColor"
                                onClickFunction={(evt) => { this.setMode('Explore', evt) }}
                            >
                                Explore
                            </ButtonCustom>

                            <ButtonCustom
                                classes="arrivalButton choiceButton primaryColor"
                                onClickFunction={(evt) => { this.setMode('Arrivals', evt) }}
                            >
                                Arrivals
                            </ButtonCustom>
                        </div>
                        <div>
                            <GenericDisplay
                                mode={this.state.currentMode}
                                rerender={this.state.rerender}
                                setRenderingStatus={this.setRenderingStatus.bind(this)}
                            >
                            </GenericDisplay>
                        </div>
                    </div>
                </div >
            )
        }
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
