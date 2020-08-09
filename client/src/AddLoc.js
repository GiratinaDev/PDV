import React from 'react';
import './Add.css';
import Swal from 'sweetalert2';

class AddLoc extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            code: '',
            rate: NaN,
            allCodes: []
        }
    }

    async componentDidMount() {
        this.props.loadPage()
        await this.callApiTwo()
            .then(res => {
                this.setState({
                    allCodes: Object.keys(res['Loc'])
                })
                console.log(res)
            })
            .catch(err => console.log(err))
        this.props.stopLoading()
    }

    callApiTwo = async () => {
        const response = await fetch('./api/database-places') 
        const body = await response.json()
        if (response.status !== 200) throw Error(body.message)
        return body;
    }

    handleType = (event) => {
        const value = event.target.value
        const id = parseInt(event.target.id)
        switch (id) {
            case 0:
                this.setState({ name: value })
                break
            case 1:
                this.setState({ code: value })
                break
            case 2:
                this.setState({ rate: value })
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
            name,
            code,
            rate,
            allCodes
        } = this.state
        if (name && code && rate) {
            if((allCodes.indexOf(code) === -1)) {
                if(code.length < 3) {
                    return true
                }
            }
        }
        return false
    }

    correctCase = (text) => {
        if (!text || text.length < 0) return ''
        var list = text.split(' ')
        for (var i = 0; i < list.length; i ++){
            list[i] = list[i].slice(0,1).toUpperCase() + list[i].slice(1).toLowerCase()
        }
        return list.join(' ')
    }

    handleAdd = async () => {
        const ready = this.check()
        if (ready) {
            this.props.loadPage()
            const {
                name,
                code,
                rate
            } = this.state
            const data = {}
            data['name'] = this.correctCase(name)
            data['code'] = code.toUpperCase()
            data['rate'] = rate
            console.log(data)
            const response = await fetch('/api/add/loc',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            console.log(response.status)
            Swal.fire({
                toast: true,
                title: name + ' added',
                icon: 'success',
                timer: 1500,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

            this.props.stopLoading()
            this.props.refresh()
            this.props.close()
        } else {
            Swal.fire({
                toast: true,
                title: 'Missing Info',
                icon: 'error',
                timer: 1500,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    codes = () => {
        const code = this.state.allCodes
        var send = 'Current codes:<br/>'
        for (var i = 0; i + 1 < code.length; i++) {
            send = send + code[i] + ', '
        }
        send = send + code[code.length - 1] + '.'
        return send
    }

    showLoc = () => {
        const showAllCodes = this.codes()
        console.log(showAllCodes)
        Swal.fire({
            title: 'Choose a 1-2 alphabetical character code for the location',
            html: showAllCodes,

        })
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
                            Add Location
                        </u></b>
                    </div>
                    <div className="add-name-wrapper">
                        Name: 
                        <input
                            type="text"
                            id='0'
                            value={this.state.name}
                            onChange={(e) => this.handleType(e)}
                            placeholder="eg. Real Art Gallery"
                        />
                    </div>
                    <div className="add-code-wrapper">
                        Code : 
                        <input
                            type="text"
                            id='1'
                            value={this.state.code}
                            onChange={(e) => this.handleType(e)}
                        />
                        <div className="question-mark" onClick={() => this.showLoc()}>
                            ?
                        </div>
                    </div>
                    <div className="add-rate-wrapper">
                        Rate :
                        <input
                            type="number"
                            id='2'
                            value={this.state.rate}
                            max='100'
                            min='0'
                            onChange={(e) => this.handleType(e)}
                        />
                        %
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

export default AddLoc