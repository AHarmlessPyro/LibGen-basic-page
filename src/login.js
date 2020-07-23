import React from 'react';


const ErrorMessageDisplay = (props) => {
    if (props.errorRaised) {
        document.getElementById('loginError').setAttribute
        window.setTimeout(() => {
            return "";
        }, 4000)
        return "Wrong username/password";
    }
    return "";
}

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        }

        this.user1 = { user: "reader1", pwd: "reader1" };
        this.user2 = { user: "reader2", pwd: "reader2" };
    }

    loginFunc(evt) {
        evt.preventDefault();

        let userValue = {
            user: document.getElementById('userEntry').value,
            pwd: document.getElementById('passwordEntry').value
        }
        if (userValue.user === this.user1.user) {
            if (userValue.pwd === this.user1.pwd) {

                this.props.successFunc('user1');
            }

        } else if (userValue.user === this.user2.user) {
            if (userValue.pwd === this.user2.pwd) {

                this.props.successFunc('user2');
            }

        } else {
            let expiry = new Date();
            expiry.setTime(expiry.getTime() + (60 * 60 * 1000)); // current time + 1 hour in ms                

            document.cookie = `user=user2; expires=${expiry}`;
        }
    }

    render() {
        return (
            <div style={{ width: "30vw" }}>
                {/*userName Entry*/}
                <div className="slot">
                    <label htmlFor="userEntry">Username</label>
                    <br></br>
                    <input type="text" className="slotElement" id="userEntry" ></input>
                </div>

                {/*passwordName Entry*/}
                <div className="slot">
                    <label htmlFor="passwordEntry">Password</label>
                    <br></br>
                    <input type="password" className="slotElement" id="passwordEntry"></input>
                </div>

                {/*login button*/}
                <div className="slot">
                    <button
                        className="primaryColor slotElement"
                        style={{ width: "100%", border: "0px", height: "30px", borderRadius: "3px" }}
                        onClick={this.loginFunc.bind(this)}
                    >
                        Login
                    </button>
                </div>

                {/*Error*/}
                <div id="loginError">
                    <ErrorMessageDisplay errorRaised={this.props.loginSuccess}></ErrorMessageDisplay>
                </div>
            </div>
        )
    }
} export default LoginPage;