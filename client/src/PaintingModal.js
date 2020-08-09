import React from 'react';
import './PModal.css';
import Swal from 'sweetalert2';
// import Axios from 'axios';

class Modal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            allTax: [],
            load: true,
            allLoc: {},
            eFile: '',
            isEdit: false,
            name: '',
            type: '',
            on: '',
            loc: 'SG',
            sold: false,
            file: '',
            price: NaN,
            sub: '',
            year: NaN,
            tax: NaN,
            paid: false,
            frame: false,
            size: {
                height: NaN,
                width: NaN
            },
            rate: false
        }
    }

    async componentDidMount() {
        this.props.loadPage()
        await this.callApiTwo()
            .then(res => {
                this.setState({
                    allLoc: res['Loc']
                })
            })
            .catch(err => console.log(err))
        await this.callApiThree()
            .then(res => {
                this.setState({
                    allTax: res['Tax']
                })
            })
            .catch(err => console.log(err))
        if (this.props.info !== -1) {
            const info = this.props.info
            this.setState({
                eFile: null,
                img: './Paintings/' + info.file,
                isEdit: true,
                name: info.name,
                type: info.type,
                on: info.on,
                loc: info.location,
                sold: info.sold,
                file: info.file,
                price: info.price,
                year: info.year,
                sub: info.sub,
                frame: info.frame,
                size: {
                    height: parseInt(info.size.height),
                    width: parseInt(info.size.width)
                }
            })
            if (info.sold) {
                this.setState({
                    paid: info.paid,
                    tax: info.tax,
                    rate: info.rate
                })
            }
        }
        this.setState({ load: false })
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

    check = () => {
        const {
            name,
            type,
            on,
            price,
            sub,
            year
        } = this.state
        const {
            width,
            height
        } = this.state.size
        if (name && type && on && price && sub && year && height && width) {
            return true
        }
        return false
    }

    postData = async() => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        })
        const ready = this.check()
        console.log(ready)
        if (ready && this.state.eFile) {
            this.props.loadPage()
            const data = new FormData()
            data.append("name", this.correctCase(this.state.name))
            data.append("type", this.correctCase(this.state.type))
            data.append("on", this.correctCase(this.state.on))
            data.append("location",this.state.loc)
            data.append("sold", this.state.sold)
            data.append("price", this.state.price)
            data.append("sub", this.correctCase(this.state.sub))
            data.append("year", this.state.year)
            data.append("height", this.state.size.height)
            data.append("width", this.state.size.width)
            data.append("image", this.state.eFile)
            data.append("frame", this.state.frame)

            console.log(this.state.size.width)

            const response = await fetch('/api/add/painting', {
                method: 'POST',
                body: data
            })
                        
            console.log(response)

            // Axios.post("http://localhost:5000/api/add/painting",data)
            //     .then(res => console.log(res))
            //     .catch(err => console.log(err))
            
            Toast.fire({
                icon: 'success',
                title: 'Painting Added'
            })

            this.props.stopLoading()
            this.props.refresh()
            this.props.close()
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Missing Info'
            })
        }
    }

    post = () => {
        console.log('hey')
    }

    handleFile = event => {
        console.log(event.target.files[0])
        this.setState({
            eFile: event.target.files[0],
            img: URL.createObjectURL(event.target.files[0])
        })

    }

    handleType = event => {
        const value = event.target.value
        const {
            allTax,
            loc,
            price
        } = this.state
        const id = parseInt(event.target.id)
        switch (id) {
            case 0:
                this.setState({ name: value })
                break
            case 1:
                if (value) {
                    this.setState({ 
                        price: value,
                        tax: parseInt( value - ( (value / 100) * allTax[loc]) )
                    })
                } else {
                    this.setState({ 
                        tax: value,
                        price: value
                    })
                }
                break
            case 2:
                if (price) {
                    this.setState({ 
                        loc: value,
                        tax: parseInt( price - ( (price / 100) * allTax[value]) )
                    })
                } else {
                    this.setState({ 
                        loc: value,
                        tax: price
                    })
                }
                break
            case 3:
                this.setState({ sub: value })
                break
            case 4:
                this.setState({ on: value })
                break
            case 5:
                this.setState({ type: value })
                break
            case 6:
                this.setState({ sold: !this.state.sold })
                break
            case 7:
                this.setState({ 
                    size: {
                        width: value,
                        height: this.state.size.height
                    }
                })
                break
            case 8:
                this.setState({ 
                    size: {
                        width: this.state.size.width,
                        height: value
                    }
                })
                break
            case 9:
                this.setState({ year: value })
                break
            case 10:
                if (value || allTax[loc] === 0) {
                    this.setState({ 
                        tax: value,
                        price: parseInt( ( value / ( 100 - allTax[loc] ) ) * 100)
                    })
                } else {
                    this.setState({ 
                        tax: value,
                        price: value
                    })
                }
                break
            case 11:
                this.setState({ paid: !this.state.paid })
                break
            case 12:
                this.setState({ frame: !this.state.frame })
                break
            default:
                break;

        }
    }

    results = () => {
        const Obj = this.state.allLoc
        const list = Object.keys(Obj)
        console.log(list)
        console.log(Obj)
        list.map(i => {
            return(
                <option value={i}> {Obj[i]} </option>
            )
        })
    }

    correctCase = (text) => {
        if (!text || text.length < 0) return ''
        var list = text.split(' ')
        for (var i = 0; i < list.length; i ++){
            list[i] = list[i].slice(0,1).toUpperCase() + list[i].slice(1).toLowerCase()
        }
        return list.join(' ')
    }


    deleteItem = async () => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        })
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete it'
        }).then(async (result) => {
            if (result.value) {
                this.props.loadPage()
                console.log(this.props.num)
                const data = {}
                data['num'] = this.props.num
                console.log(data)
                const response = await fetch('/api/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                console.log(response)
                Toast.fire({
                    icon: 'success',
                    title: this.state.name + ' deleted'
                })
                this.props.stopLoading()
                this.props.refresh()
                this.props.close()
            }
        })
    }

    editData = async () => {
        const ready = this.check()
        if (ready) {
            this.props.loadPage()
            const {
                allTax,
                name,
                type,
                on,
                loc,
                sold,
                file,
                price,
                year,
                sub,
                tax,
                paid
            } = this.state
            const {
                width,
                height
            } = this.state.size
            const data = {}
            data['name'] = this.correctCase(name)
            data['type'] = this.correctCase(type)
            data['on'] = this.correctCase(on)
            data['location'] = loc
            data['sold'] = sold
            data['file'] = file
            data['price'] = price
            data['year'] = year
            data['sub'] = this.correctCase(sub)
            data['width'] = width
            data['height'] = height
            data['num'] = this.props.num
            data['frame'] = this.state.frame
            if (sold) {
                data['tax'] = tax
                data['left'] = price - tax
                data['paid'] = paid
                data['rate'] = allTax[loc]
            }
            const response = await fetch('/api/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            console.log(response)

            Swal.fire({
                toast: true,
                title: this.correctCase(name) + ' updated',
                icon: 'success',
                timer: 1500,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

            this.props.stopLoading()
            this.props.refresh()
            this.props.close()
        }
    }

    enterPressed = (event) => {
        if (event.key === 'Enter') {
            if (this.state.isEdit) {
                this.editData()
            } else {
                this.postData()
            }
        }
    }

    clickSold = () => {
        const sold = this.state.sold
        this.setState({ sold: !sold })
        if (!sold) {
            this.setState({ paid: !sold })
        }
    }

    render() {
        return(
            <div className="edit-modal">
                {this.state.load ? null : (
                    <div className="edit" onKeyPress={(e) => this.enterPressed(e)}>
                        <div className="upper">
                            <div className="high">
                                <div className="name">
                                    <input 
                                        className="name-input"
                                        type="text" 
                                        placeholder="Title"
                                        id='0'
                                        onChange={
                                            (e) => this.handleType(e)
                                        }
                                        value={this.state.name}
                                    />
                                </div>
                                <div className="size">
                                    (
                                    <div className="width">
                                        <input 
                                            className="width-input"
                                            type="number" 
                                            placeholder="W"
                                            id='7'
                                            onChange={
                                                (e) => this.handleType(e)
                                            }
                                            value={this.state.size.width}
                                        />
                                    </div>
                                    <div className="text">
                                        x
                                    </div>
                                    <div className="height">
                                        <input 
                                            className="height-input"
                                            type="number" 
                                            placeholder="H"
                                            id='8'
                                            onChange={
                                                (e) => this.handleType(e)
                                            }
                                            value={this.state.size.height}
                                        />
                                    </div>
                                    )
                                </div>
                                <div className="year">
                                    <input 
                                        type="number"
                                        placeholder="Year"
                                        id='9'
                                        onChange={
                                            (e) => this.handleType(e)
                                        }
                                        value={this.state.year}
                                    />
                                </div>
                            </div>
                            <div className="subject">
                                <input 
                                    className="subject-input"
                                    type="text" 
                                    placeholder="Subject"
                                    id='3'
                                    onChange={
                                        (e) => this.handleType(e)
                                    }
                                    value={this.state.sub}
                                />
                            </div>
                        </div>
                        <div className="lower">
                            <div className="left">
                                <div className="image">
                                    {this.state.isEdit ? (
                                        <img 
                                            src={require('./Paintings/'+ this.state.file)}
                                            alt=""
                                        />
                                    ) : (
                                        <img src={this.state.img} alt="" />
                                    )}
                                </div>
                                <div>
                                    {this.state.isEdit ? null : (
                                        <input type="file" onChange={this.handleFile}/>
                                    )}
                                </div>
                            </div>
                            <div className="right">
                                <div className="medium">
                                    <div className="PMTitle">
                                        Medium
                                    </div>
                                    <div className="medium-edit">
                                        <div className="input-medium">
                                            <input 
                                                type="text" 
                                                placeholder="Medium"
                                                id='5'
                                                onChange={
                                                    (e) => this.handleType(e)
                                                }
                                                value={this.state.type}
                                            />
                                        </div>
                                        <div className="text">
                                            on
                                        </div>
                                        <div className="input-medium">
                                            <input 
                                                type="text" 
                                                placeholder="Surface"
                                                id='4'
                                                onChange={
                                                    (e) => this.handleType(e)
                                                }
                                                value={this.state.on}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="location">
                                    <div className="PMTitle">
                                        Location
                                    </div>
                                    <select 
                                        value={this.state.loc} 
                                        onChange={(e) => this.handleType(e)} 
                                        id='2'
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
                                <div className="price">
                                    <div className="PMTitle">
                                        Price
                                    </div>
                                    <div className="full-price">
                                        <div className="price-edit">
                                            <div className="text">
                                                £
                                            </div>
                                            <input 
                                                type="number" 
                                                placeholder="Price"
                                                id='1'
                                                onChange={
                                                    (e) => this.handleType(e)
                                                }
                                                value={this.state.price}
                                            />
                                        </div>
                                        {this.state.rate ? (
                                            <div className="tax-text">
                                                Commission : {this.state.rate} %
                                            </div>
                                        ) : ( 
                                            <div className="tax-text">
                                                Commission : {this.state.allTax[this.state.loc]} %
                                            </div>
                                        )}
                                        <div className="left-edit">
                                            <div className="text">
                                                £
                                            </div>
                                            <input 
                                                type="number" 
                                                placeholder="Net"
                                                id='10'
                                                onChange={
                                                    (e) => this.handleType(e)
                                                }
                                                value={this.state.tax}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="checkbox">
                                    <div className="PMSold">
                                        <div className="sold-title" onClick={() => this.clickSold()}>
                                            SOLD
                                        </div>
                                        <label className="container">
                                            <input 
                                                type="checkbox"
                                                id='6'
                                                onChange={
                                                    (e) => this.handleType(e)
                                                }
                                                checked={this.state.sold}
                                            />
                                            <span className="checkmark"/>
                                        </label>
                                    </div>
                                    {this.state.sold && this.state.isEdit ? (
                                        <div className="PMSold">
                                            <div className="sold-title" onClick={() => this.setState({ paid: !this.state.paid })}>
                                                PAID
                                            </div>
                                            <label className="container">
                                                <input 
                                                    type="checkbox"
                                                    id='11'
                                                    onChange={
                                                        (e) => this.handleType(e)
                                                    }
                                                    checked={this.state.paid}
                                                />
                                                <span className="checkmark"/>
                                            </label>
                                        </div>
                                    ) : null }
                                </div>
                                <div className="PMSold">
                                    <div className="sold-title" onClick={() => this.setState({ frame: !this.state.frame })}>
                                        FRAMED
                                    </div>
                                    <label className="container">
                                        <input 
                                            type="checkbox"
                                            id='12'
                                            onChange={
                                                (e) => this.handleType(e)
                                            }
                                            checked={this.state.frame}
                                        />
                                        <span className="checkmark"/>
                                    </label>
                                </div>
                                <div className="end">
                                    {this.state.isEdit ? (
                                        <button className="del" onClick={() => this.deleteItem()}>
                                            Delete
                                        </button>
                                    ): null}
                                    <button onClick={() => this.props.close()}>
                                        Cancel
                                    </button>
                                    {this.state.isEdit ? (
                                        <button onClick={() => this.editData()}>
                                            Save
                                        </button>
                                    ) : (
                                        <button onClick={() => this.postData()}>
                                            Add
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default Modal