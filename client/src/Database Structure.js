import React from 'react';
import './DS.css';
import Swal from 'sweetalert2';
import * as Listy from './listy';

class Database extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            database: {},
            allPlaces: undefined,
            order: '',
            desc: true,
            renderOrder: [],
            filterCol: [],
            filterBy: {},
            name: '',
            showSold: true,
            showDiff: false,
            preSold: [],
            tax: []
        }
    }

    async componentDidUpdate(props) {
        if  (this.props.refresh !== props.refresh) {
            this.props.loadPage()
            await this.callApi()
                .then(res => {
                    this.setState({
                        database: res['PDD'],
                        renderOrder: Object.keys(res['PDD'])
                    })
                })
                .catch(err => console.log(err))
            await this.callApiTwo()
                .then(res => {
                    this.setState({
                        allPlaces: res['Loc']
                    })
                })
                .catch(err => console.log(err))
            this.props.stopLoading()
        }
    }

    async componentDidMount() {
        this.props.loadPage()
        await this.callApi()
            .then(res => {
                this.setState({
                    database: res['PDD'],
                    renderOrder: Object.keys(res['PDD'])
                })
            })
            .catch(err => console.log(err))
        await this.callApiTwo()
            .then(res => {
                this.setState({
                    allPlaces: res['Loc']
                })
            })
            .catch(err => console.log(err))
        await this.callApiThree()
            .then(res => {
                this.setState({
                    tax: res['Tax']
                })
            })
            .catch(err => console.log(err))
        this.props.stopLoading()
    }

    callApi = async () => {
        const response = await fetch('./api/database-info') 
        const body = await response.json()
        if (response.status !== 200) throw Error(body.message)
        return body;
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

    show = () => {
        var list = this.state.renderOrder
        var data = this.state.database
        if (list.length !== 0 && this.state.allPlaces) {
            return (
                <table className="full-database">
                    <thead>
                        <tr>
                            {this.state.order === 'name' ? (
                                <th id="name" onClick={(e) => this.changeOrder(e)}>
                                    {this.state.desc ? (
                                        'Title ⌄'
                                    ) : (
                                        'Title ⌃'
                                    )}
                                </th>
                            ) : (
                                <th id="name" onClick={(e) => this.changeOrder(e)}>
                                    Title
                                </th>
                            )}
                            <th className="picture">
                                Image
                            </th>
                            {this.state.order === 'sub' ? (
                                <th id="sub" onClick={(e) => this.changeOrder(e)}>
                                    {this.state.desc ? (
                                        'Subject ⌄'
                                    ) : (    // Subject filter
                                        'Subject ⌃'
                                    )}
                                </th>
                            ) : (
                                <th id="sub" onClick={(e) => this.changeOrder(e)}>
                                    Subject
                                </th>
                            )}
                            {this.state.order === 'on' ? (
                                <th id="on" onClick={(e) => this.changeOrder(e)}>
                                    {this.state.desc ? (
                                        'Medium ⌄'
                                    ) : (    // Medium filter
                                        'Medium ⌃'
                                    )}
                                </th>
                            ) : (
                                <th id="on" onClick={(e) => this.changeOrder(e)}>
                                    Medium
                                </th>
                            )}
                            {this.state.order === 'location' ? (
                                <th id="location" onClick={(e) => this.changeOrder(e)}>
                                    {this.state.desc ? (
                                        'Location ⌄'
                                    ) : (     // Location filter
                                        'Location ⌃'
                                    )}
                                </th>
                            ) : (
                                <th id="location" onClick={(e) => this.changeOrder(e)}>
                                    Location
                                </th>
                            )}
                            <th className="edit">
                                Size
                            </th>
                            {this.state.order === 'year' ? (
                                <th id="year" onClick={(e) => this.changeOrder(e)}>
                                    {this.state.desc ? (
                                        'Year ⌄'
                                    ) : (     // Year filter
                                        'Year ⌃'
                                    )}
                                </th>
                            ) : (
                                <th id="year" onClick={(e) => this.changeOrder(e)}>
                                    Year
                                </th>
                            )}
                            <th className="frame">
                                Framed
                            </th>
                            {this.state.order === 'price' ? (
                                <th id="price" onClick={(e) => this.changeOrder(e)}>
                                    {this.state.desc ? (
                                        'Price ⌄'
                                    ) : (     // Price filter
                                        'Price ⌃'
                                    )}
                                </th>
                            ) : (
                                <th id="price" onClick={(e) => this.changeOrder(e)}>
                                    Price
                                </th>
                            )}
                            <th className="tax">
                                G. Tax
                            </th>
                            <th className="left">
                                Net +
                            </th>
                            {this.props.admin ? (
                                <th className="edit">
                                    Edit
                                </th>
                            ) : null}
                        </tr>
                    </thead>
                    {list.map(i => {
                        if (this.state.showDiff) {
                            if (this.state.showSold === data[i]['sold']) {
                                return(
                                    <tbody key={i}>
                                        <tr>
                                            <td>
                                                {this.correctCase(data[i]['name'])}
                                            </td>
                                            <td className="database-thumb">
                                                <div 
                                                    className="thumbnail"
                                                    onClick={() => this.props.img(data[i]['file'])}
                                                >
                                                    <img 
                                                        src={require('./Paintings/'+ data[i]['file'])}
                                                        alt=""
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                {this.correctCase(data[i]['sub'])}
                                            </td>
                                            <td>
                                                {this.correctCase(data[i]['type'])} on {this.correctCase(data[i]['on'])}
                                            </td>
                                            <td>
                                                {this.place(data[i]['location'])}
                                            </td>
                                            <td>
                                                <div className="dimensions">
                                                    {this.disDim(data[i]['size'])}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="year">
                                                    {data[i]['year']}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="frame">
                                                    {data[i]['frame'] ? ('Yes'):('No')}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="amount">
                                                    {this.currency(data[i]['price'])}
                                                </div>
                                            </td>
                                            <td>
                                                {data[i]['tax'] ? (
                                                    <div className="tax">
                                                        {data[i]['tax']}
                                                    </div>
                                                ) : (
                                                    <div className="tax">
                                                        {this.calcTax(data[i]['location'],data[i]['price'])}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {data[i]['left'] ?  (
                                                    <div className="tax">
                                                        {data[i]['left']}
                                                    </div>  
                                                ) : (
                                                    <div className="tax">
                                                        {this.calcLeft(data[i]['location'],data[i]['price'])}
                                                    </div>
                                                )}
                                            </td>
                                            {this.props.admin ? (
                                                <td id={i} className="edit" onClick={() => this.props.addEdit(data[i],i)}>
                                                    ...
                                                </td>
                                            ) : null}
                                        </tr>
                                    </tbody>
                                )
                            } else {
                                return (
                                    null
                                )
                            }
                        } else {
                            return (
                                <tbody key={i}>
                                    <tr>
                                        <td>
                                            {this.correctCase(data[i]['name'])}
                                        </td>
                                        <td className="database-thumb">
                                            <div 
                                                className="thumbnail"
                                                onClick={() => this.props.img(data[i]['file'])}
                                            >
                                                <img 
                                                    src={require('./Paintings/'+ data[i]['file'])}
                                                    alt=""
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            {this.correctCase(data[i]['sub'])}
                                        </td>
                                        <td>
                                            {this.correctCase(data[i]['type'])} on {this.correctCase(data[i]['on'])}
                                        </td>
                                        <td>
                                            {this.place(data[i]['location'])}
                                        </td>
                                        <td>
                                            <div className="dimensions">
                                                {this.disDim(data[i]['size'])}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="year">
                                                {data[i]['year']}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="frame">
                                                {data[i]['frame'] ? ('Yes'):('No')}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="amount">
                                                {this.currency(data[i]['price'])}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="tax">
                                                {this.calcTax(data[i]['location'],data[i]['price'])}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="tax">
                                                {this.calcLeft(data[i]['location'],data[i]['price'])}
                                            </div>
                                        </td>
                                        {this.props.admin ? (
                                            <td id={i} className="edit" onClick={() => this.props.addEdit(data[i],i)}>
                                                ...
                                            </td>
                                        ) : null}
                                    </tr>
                                </tbody>
                            )
                        }
                    }).reverse() }
                </table>
            )
        }
    }

    calcLeft = (x, price) => {
        const tax = this.state.tax[x]
        const send = (price / 100) * (100 - tax)
        return this.currency(parseInt(send))
    }

    calcTax = (x, price) => {
        const tax = this.state.tax[x]
        const send = (price / 100) * tax
        return this.currency(parseInt(send))
    }

    disDim = (dim) => {
        if(!dim) return ''
        var ret = [dim.width, 'x', dim.height]
        return ret.join(' ')
    }

    currency = (num) => {
        if(!num) return '£0'
        var strNum = num.toString()
        var listStrNum = strNum.split('')
        var sendList = ['']
        for(var i = 1; i - 1 < listStrNum.length; i++) {
            sendList.splice(0, 0, listStrNum[ listStrNum.length - i])
            if(i < listStrNum.length)
                if (i % 3 === 0) {
                    sendList.splice(0, 0, ',')
                }
        }
        sendList.splice(0, 0, '£')
        return sendList.join('')
    } 

    correctCase = (text) => {
        if (!text || text.length < 0) return ''
        var list = text.split(' ')
        for (var i = 0; i < list.length; i ++){
            list[i] = list[i].slice(0,1).toUpperCase() + list[i].slice(1).toLowerCase()
        }
        return list.join(' ')
    }

    place = (loc) => {
        const list = this.state.allPlaces
        if(list[loc]) return list[loc]
        return 'Error'
    }

    changeOrder = (e) => {
        this.props.loadPage()
        var or = this.state.order
        var de = this.state.desc
        if(this.state.order === e.target.id) {
            this.setState({ desc: !this.state.desc })
            de = !de
        } else {
            this.setState({ order: e.target.id, desc: true })
            or = e.target.id
            de = true
        }
        this.setOrder(or, de)
    }

    setOrder = (order,desc) => {
        console.log(order)
        const data = this.state.database
        const vLookUp = this.state.renderOrder
        var finalList = Listy.orderTheList(data,order,vLookUp)
        if (!desc) finalList.reverse()
        this.setState({ renderOrder: finalList })
        this.props.stopLoading()
    }

    handleClick = async () => {
        const { value: col } = await Swal.fire({
            title: 'Select column to filter',
            input: 'radio',
            inputOptions: {sub : "Subject", on : "Medium 1", type : "Medium 2", location : "Location", year: 'Year'},
            inputValidator: (value) => {
                if (!value) {
                    return 'Click an option to continue, or click off to close.'
                }
            }
        })
        if (col) {
            var filterList = this.state.filterCol 
            filterList.push(col)
            var inputOptions = {}
            if (col === 'location') {
                inputOptions = this.state.allPlaces
            } else {
                const option = Listy.findAllValues(this.state.database,col)
                const Option = this.correctCase(option.join(' ')).split(' ')
                for (var i = 0; i < Option.length; i ++) {
                    if (Option[i] !== "")  {
                        inputOptions[option[i]] = Option[i]
                    }
                }
            }
            const { value: dec } = await Swal.fire({
                title: 'Select the filter',
                input: 'radio',
                inputOptions: inputOptions,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Click an option to continue, or click off to close.'
                    }
                }
            })
            if (dec) {
                this.props.loadPage()
                var by = this.state.filterBy
                if (by[col]) by[col].push(dec)
                else by[col] = [dec]
                this.setState({ filterBy: by })
                this.setState({ filterCol: filterList })
                const newValues = Listy.filterFilteredColumn(this.state.database,filterList,by,Object.keys(this.state.database))
                this.setState({ renderOrder: newValues })
                this.setOrder(this.state.order, this.state.desc)
                this.props.stopLoading()
            }
        }
    }

    handleSleep = async() => {
        this.props.loadPage()
        await new Promise(r => setTimeout(r,2000));
        console.log(this.currency(123456))
        this.props.stopLoading()
        console.log(this.state.database['1']['price'])
    }

    handleType = (e) => {
        const x = e.target.value
        console.log(x)
        var nameList = Listy.findName(this.state.database,x)
        this.setState({ renderOrder: nameList, name: x })
    }

    reset = () => {
        this.setState({ 
            order: '', 
            desc: true, 
            renderOrder: Object.keys(this.state.database),
            filterCol: [],
            filterBy: [],
            name: '',
            showSold: true,
            showDiff: false
        })
    }

    soldClick = () => {
        Listy.filterColumn()
        const {
            showDiff,
            showSold
        } = this.state
        if (showDiff) {
            if (showSold) {
                this.setState({ showSold: false })
            } else {
                this.setState({
                    showSold: true,
                    showDiff: false
                })
            }
        } else {
            this.setState({ showDiff: true })
        }
    }

    addInfo = async () => {
        const { value: add } = await Swal.fire({
            title: 'Add what?',
            input: 'radio',
            inputOptions: {
                '0': 'Add new user',
                '1': 'Add new location',
                '2': 'Alter location rate'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Click an option to continue, or click off to close.'
                }
            }
        })
        switch (parseInt(add)) {
            case 0:
                this.props.addUser()
                break
            case 1:
                this.props.addLoc()
                break
            case 2:
                this.props.editLoc()
                break
            default:
                break
        }
    }

    render() {
        return(
            <div className="database">
                <div className="database-wrapper">
                    {this.props.admin ? (
                        <h1 className="DSTitle-admin" onClick={() => this.addInfo()}>
                            <u>List</u>
                        </h1>
                    ) : (
                        <h1 className="DSTitle">
                            <u>List</u>
                        </h1>
                    )}
                    <div className="search-bar">
                        <input type="text" placeholder="Search by Title" onChange={(e) => this.handleType(e)} value={this.state.name}/>
                    </div>
                    <br/><br/>
                    <div className="filter">
                        <button className="filter-button" onClick={() => this.handleClick()}>Filter</button>
                    </div>
                    <div>
                        <u className="reset" onClick={() => this.reset()}>
                            Reset
                        </u>
                    </div>
                    <br/>
                    {this.props.admin ? (
                        <div className="hidden-admin">
                            hi
                        </div>
                    ) : (
                        <div className="hidden">
                            hi
                        </div>
                    )}
                    <br/>
                    {this.props.admin ? (
                        <div className="add">
                            <button className="add-button" onClick={() => this.props.addEdit(-1)}>Add Entry</button>
                        </div>
                    ) : null}
                    <div className="sold">
                        {this.state.showDiff ? (
                            <div className="sold-text" onClick={() => this.soldClick()}>
                                Show
                                {this.state.showSold ? (
                                    <b> sold </b>
                                ) : (
                                    <b> unsold </b>
                                )}
                                paintings
                            </div>
                        ) : (
                            <div className="sold-text" onClick={() => this.soldClick()}>
                                Show <b>all</b> paintings
                            </div>
                        )}
                    </div>
                </div>
                {this.show()}
            </div>
        )
    }
}

export default Database