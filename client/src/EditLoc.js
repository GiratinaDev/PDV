import React from 'react';
import './Add.css';
import Swal from 'sweetalert2';

class EditLoc extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            allTax: [],
            allLoc: [],
            loc: '',
            rate: NaN
        }
    }

    async componentDidMount() {
        this.props.loadPage()
        var a 
        await this.callApiTwo()
            .then(res => {
                const x = Object.keys(res['Loc'])
                a = x[0]
                this.setState({
                    allLoc: res['Loc'],
                    loc: a
                })
            })
            .catch(err => console.log(err))
        await this.callApiThree()
            .then(res => {
                this.setState({
                    allTax: res['Tax'],
                    rate: res['Tax'][a]
                })
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

    callApiThree = async () => {
        const response = await fetch('./api/database-tax') 
        const body = await response.json()
        if (response.status !== 200) throw Error(body.message)
        return body;
    }

    handleType = event => {
        const value = event.target.value
        const id = parseInt(event.target.id)
        switch (id) {
            case 0: 
                this.setState({
                    loc: value,
                    rate: this.state.allTax[value]
                })
                break
            case 1:
                this.setState({ rate: value })
                break
            default:
                break
        }
    }

    check = () => {
        const {
            rate
        } = this.state
        if (0 < rate && rate < 100){
            return true
        }
        return false
    }

    handleAdd = async () => {
        const ready = this.check()
        if (ready) {
            this.props.loadPage()
            const {
                loc,
                rate
            } = this.state
            const data = {}
            data['code'] = loc.toUpperCase()
            data['rate'] = rate
            console.log(data)
            const response = await fetch('/api/edit/loc',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            console.log(response.status)
            Swal.fire({
                toast: true,
                title: this.state.allLoc[loc] + ' updated',
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
                    <div className="location">
                    <select 
                        value={this.state.loc} 
                        onChange={(e) => this.handleType(e)} 
                        id='0'
                    >
                        {
                            Object.keys(this.state.allLoc).map(i => {
                                return(
                                    <option value={i}> {this.state.allLoc[i]} </option>
                                )
                            })
                        }
                    </select>
                </div>
                    <div className="add-rate-wrapper">
                    Rate :
                    <input
                        type="number"
                        id='1'
                        value={this.state.rate}
                        max='100'
                        min='0'
                        onChange={(e) => this.handleType(e)}
                    />
                    %
                </div>
                    <div className="add-button-wrapper">
                        <button className="add-enter" onClick={() => this.props.close()}>
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

export default EditLoc