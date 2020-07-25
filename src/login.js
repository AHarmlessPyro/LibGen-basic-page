import React from 'react';


/* Props : 
successFunc : On Login success for $user, do something
failFunc : On Login fail, do something
*/

const ErrorMessageDisplay = (props) => {
    //debugger;
    if (!props.errorRaised && props.canDisplay) {
        //document.getElementById('loginError').setAttribute
        // window.setTimeout(() => {
        //     return "";
        // }, 4000)
        return <label className="textFade errorText">Unknown username/password</label>;
    }
    return "";
}

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessageCheck: false
        }

        this.user1 = { user: "reader1", pwd: "reader1" };
        this.user2 = { user: "reader2", pwd: "reader2" };
        this.timerFunc = undefined;
    }

    loginFunc(evt) {
        evt.preventDefault();

        this.setState({ errorMessageCheck: true });
        this.timerFunc = window.setTimeout(() => {
            this.setState({ errorMessageCheck: false });
        }, 4000);

        let userValue = {
            user: document.getElementById('userEntry').value,
            pwd: document.getElementById('passwordEntry').value
        }

        if (userValue.user === this.user1.user) {
            if (userValue.pwd === this.user1.pwd) {

                this.props.successFunc(userValue.user);
            }

        } else if (userValue.user === this.user2.user) {
            if (userValue.pwd === this.user2.pwd) {

                this.props.successFunc(userValue.user);
            }

        } else {
            this.props.failFunc();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timerFunc);
    }

    render() {
        return (
            <div style={{ width: "30vw" }}>
                {/*userName Entry*/}
                <div className="slot">
                    <label htmlFor="userEntry">Username</label>
                    <br></br>
                    <input type="text" className="slotElement border" id="userEntry" ></input>
                </div>

                {/*passwordName Entry*/}
                <div className="slot">
                    <label htmlFor="passwordEntry">Password</label>
                    <br></br>
                    <input type="password" className="slotElement border" id="passwordEntry"></input>
                </div>

                {/*login button*/}
                <div className="slot">
                    <button
                        className="primaryColor slotElement border"
                        style={{ width: "100%", border: "0px", height: "30px", borderRadius: "3px" }}
                        onClick={this.loginFunc.bind(this)}>
                        Login
                    </button>
                </div>

                {/*Error*/}
                <div id="loginError">
                    <ErrorMessageDisplay
                        /* Check if login button has been clicked*/
                        canDisplay={this.state.errorMessageCheck}
                        /* Check if login was a success*/
                        errorRaised={this.props.loginSuccess}>

                    </ErrorMessageDisplay>
                </div>
            </div>
        )
    }
} export default LoginPage;