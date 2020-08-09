import React from 'react';
import './Add.css';
import Swal from 'sweetalert2';

class AddUser extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: '',
            pass: '',
            admin: false
        }
    }

    handleType = (event) => {
        const value = event.target.value
        const id = parseInt(event.target.id)
        switch (id) {
            case 0:
                this.setState({ user: value })
                break
            case 1:
                this.setState({ pass: value })
                break
            case 2:
                this.setState({ admin: !this.state.admin })
                break
            default:
                break
        }
    }

    handleCancel = () => {
        this.props.close()
    }

    check = () => {
        const {
            user,
            pass
        } = this.state
        if (user && pass) {
            return true
        }
        return false
    }

    handleAdd = async () => {
        const ready = this.check()
        if (ready) {
            this.props.loadPage()
            const {
                user,
                pass,
                admin
            } = this.state
            const data = {}
            data['username'] = user
            data['password'] = pass
            data['admin'] = admin
            console.log(data)
            const response = await fetch('/api/add/user',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            console.log(response.status)
            Swal.fire({
                toast: true,
                title: user + ' added',
                icon: 'success',
                timer: 1500,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

            this.props.stopLoading()
            this.props.close()
        } else {
            Swal.fire({
                toast: true,
                title: 'Missing info',
                icon: 'error',
                timer: 1500,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    enterPressed = (event) => {
        console.log(event)
        console.log(event.key)
        if (event.key === 'Enter') {
            this.handleAdd()
        }
    }

    render() {
        return (
            <div className="add-user-page" onKeyPress={(e) => this.enterPressed(e)}>
                <div className="add-wrapper">
                    <div className="title">
                        <b><u>
                            Add User
                        </u></b>
                    </div>
                    <div className="add-username-wrapper">
                        Username: 
                        <input
                            type="text"
                            id='0'
                            value={this.state.user}
                            onChange={(e) => this.handleType(e)}
                            placeholder="eg. UserName"
                        />
                    </div>
                    <div className="add-password-wrapper">
                        Password : 
                        <input 
                            type="password"
                            id='1'
                            value={this.state.pass}
                            onChange={(e) => this.handleType(e)} 
                            placeholder="eg. P@ssW0rd"
                        />
                    </div>
                    <div className="add-admin-wrapper">
                        <div className="add-admin-title">
                            Admin
                        </div>
                        <label className="container">
                            <input 
                                type="checkbox"
                                id='2'
                                onChange={
                                    (e) => this.handleType(e)
                                }
                                checked={this.state.admin}
                            />
                            <span className="checkmark"/>
                        </label>
                    </div>
                    <div className="add-button-wrapper">
                        <button className="add-enter" onClick={() => this.handleCancel()}>
                            Cancel
                        </button>
                        <button className="add-enter" onClick={() => this.handleAdd()}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddUser