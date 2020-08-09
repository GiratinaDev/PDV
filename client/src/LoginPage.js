import React from 'react';
import './LoginPage.css';
import Swal from 'sweetalert2';

class LoginPage extends React.Component {

    constructor(props) { //creates global variables
        super(props) //is required to keep variables as something
        this.state = { //state = global variables
            Users: '',
            responseToPost: '',
            user: '',
            pass: '',
            signUp: false,
        }
        this.handlePassChange = this.handlePassChange.bind(this)//see below
        this.handleUserChange = this.handleUserChange.bind(this)//see below
        this.handleClick = this.handleClick.bind(this)// fixes variable issues
    }

    componentDidMount() {
        this.callApi()
          .then(res => {
              this.setState({ Users: res['Users']})
          })
          .catch(err => console.log(err));
      }
      
    callApi = async () => {
        const response = await fetch('/api/users');
        const body = await response.json();
        console.log(response)
        if (response.status !== 200) throw Error(body.message);
        return body;
    };
    
    handlePassChange(e) {
        this.setState({
            pass: e.target.value
        })
    }

    handleUserChange(e) {
        this.setState({
            user: e.target.value
        })
    }

    handleClick() {
        const User = this.state.Users
        const len = Object.keys(User).length
        for (var i = 0; i < len; i++) {
            if (User[i]['username'] === this.state.user) {
                if (User[i]['password'] === this.state.pass) {
                    this.props.admin(User[i]['admin'])
                    this.props.isLogedIn()
                    return
                } else {
                    Swal.fire({
                        title: 'Password is Incorrect',
                        icon: 'warning',
                        timer: '1000',
                        showConfirmButton: false
                    })
                    return
                }
            }
        }
        Swal.fire({
            title: 'User is not recognised',
            icon: 'error',
            timer: '1000',
            showConfirmButton: false
        })
    }

    checkDataBase() {
        var users = this.state.Users['Users']
        var stateUsernsme = this.state.user
        var statePassword = this.state.pass
        var len = Object.keys(users)
        for (var i = 1 ; i < len.length ; i++) {
            var data = i.toString()
            var user = users[data]['info']
            if (stateUsernsme === user['username']) {
                if(statePassword === user['password']) {
                    return true
                } 
            }
        }
        return false
    }

    findInDatabase() {
        var users = this.state.Users['Users']
        var stateUsernsme = this.state.user
        var statePassword = this.state.pass
        var len = Object.keys(users)
        for (var i = 0 ; i <= len.length ; i++) {
            var data = i.toString()
            var user = users[data]['info']
            if (stateUsernsme === user['username']) {
                if(statePassword === user['password']) {
                    return data
                } 
            }
        }
        return false
    }

    forgotPass() {
        Swal.fire({
            title: 'Not yet avaliable',
            timer: 2000
        })
    }

    render() {
        return (
            <div className="login-page">
                <div className="login-wrapper">
                    <div className="title">
                        <b><u>
                            Sign In
                        </u></b>
                    </div>
                    <form onSubmit={() => this.handleClick()}>
                        <div className="username-wrapper">
                            Username: 
                            <input type="text" value={this.state.user} onChange={this.handleUserChange} placeholder="eg. UserName"/>
                        </div>
                        <div className="password-wrapper">
                            Password : 
                            <input type="password" value={this.state.pass} onChange={this.handlePassChange}  placeholder="eg. P@ssW0rd" />
                        </div>
                        <div className="button-wrapper">
                            <button className="enter" onClick={() => this.handleClick()}>
                                Sign In
                            </button>
                        </div>
                        <div className="reset">
                            <p className="switch">
                                <u>
                                    <i onClick={() => this.forgotPass()}>
                                        Forgot your password?
                                    </i>
                                </u>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginPage;