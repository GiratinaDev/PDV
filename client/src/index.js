import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LoginPage from './LoginPage';
import Swal from 'sweetalert2';
import '@sweetalert2/themes/dark/dark.css';
import Database from './Database Structure';
import LoadingCircle from './LoadingCircle';
import Modal from './PaintingModal';
import AddUser from './AddUser';
import AddLoc from './AddLoc';
import EditLoc from './EditLoc';

class PlannerApp extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLogedIn: false,
            userNumber: 0,
            showImg: false,
            loc: '',
            loading: false,
            addEdit: false,
            info: -1,
            refresh: 0,
            num: NaN,
            admin: false,
            addUser: false,
            addLoc: false,
            editLoc: false,
        }
    }

    showSwal(e) {
        this.setState({
            isLogedIn: !this.state.isLogedIn
        })
        const Toast = Swal.mixin({
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        if (this.state.isLogedIn) {
            Toast.fire({
                title: 'Signed out successfully'
            })
            this.setState({ userNumber: 0 })
        } else {
            Toast.fire({
                title: 'Signed in successfully'
            })
        }
    }

    openImg(loc) {
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = '17px'
        this.setState({
            showImg: true,
            loc: loc
        })
    }

    load() {
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = '17px'
        this.setState({
            loading: true
        })
    }

    unLoad() {
        document.body.style.overflow = 'auto'
        document.body.style.paddingRight = '0px'
        this.setState({
            loading: false
        })
    }

    openModal(x,y) {
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = '17px'
        this.setState({
            addEdit: true,
            info: x,
            num: y
        })
    }

    closeModal() {
        document.body.style.overflow = 'auto'
        document.body.style.paddingRight = '0px'
        this.setState({
            addEdit: false,
            info: -1,
            num: NaN
        })
    }

    refreshPage() {
        this.setState({ refresh: this.state.refresh + 1 })
        console.log(this.state.refresh)
    }

    isAdmin(a) {
        this.setState({ admin: a })
        console.log(a)
    }

    openAdd() {
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = '17px'
        this.setState({
            addUser: true
        })
    }

    closeAdd() {
        document.body.style.overflow = 'auto'
        document.body.style.paddingRight = '0px'
        this.setState({
            addUser: false
        })
    }

    openLoc() {
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = '17px'
        this.setState({
            addLoc: true
        })
    }

    closeEdit() {
        document.body.style.overflow = 'auto'
        document.body.style.paddingRight = '0px'
        this.setState({
            editLoc: false
        })
    }    

    openEdit() {
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = '17px'
        this.setState({
            editLoc: true
        })
    }

    closeLoc() {
        document.body.style.overflow = 'auto'
        document.body.style.paddingRight = '0px'
        this.setState({
            addLoc: false
        })
    }

    render() {
        return (
            <div className="main-page">
                {this.state.isLogedIn ? (
                    <div>
                        {this.state.showImg ? (
                            <div className="backdrop">
                                <img 
                                    className="painting" 
                                    onClick={() => {
                                        this.setState({ showImg: false })
                                        document.body.style.overflow = 'auto'
                                        document.body.style.paddingRight = '0px'
                                    }}
                                    src={require('./Paintings/' + this.state.loc)}
                                    alt=""
                                />
                            </div>
                        ) : (
                            null
                        )}
                        {this.state.loading ? (
                            <div className="load">
                                <LoadingCircle/>
                            </div>
                        ) : null }
                        {this.state.addEdit ? (
                            <div className="modal">
                            {this.state.loading ? (
                                <div className="load">
                                    <LoadingCircle/>
                                </div>
                            ) : null }
                                <Modal
                                    info = {this.state.info}
                                    num = {this.state.num}
                                    refresh={() => this.refreshPage()}
                                    loadPage={() => this.load()}
                                    stopLoading={() => this.unLoad()}
                                    close={() => this.closeModal()}
                                />
                            </div>
                        ) : null }
                        {this.state.addUser ? (
                            <div className="modal">
                            {this.state.loading ? (
                                <div className="load">
                                    <LoadingCircle/>
                                </div>
                            ) : null }
                                <AddUser
                                    loadPage={() => this.load()}
                                    stopLoading={() => this.unLoad()}
                                    close={() => this.closeAdd()}
                                />
                            </div>
                        ) : null }
                        {this.state.addLoc ? (
                            <div className="modal">
                            {this.state.loading ? (
                                <div className="load">
                                    <LoadingCircle/>
                                </div>
                            ) : null }
                                <AddLoc
                                    refresh={() => this.refreshPage()}
                                    loadPage={() => this.load()}
                                    stopLoading={() => this.unLoad()}
                                    close={() => this.closeLoc()}
                                />
                            </div>
                        ) : null }
                        {this.state.editLoc ? (
                            <div className="modal">
                            {this.state.loading ? (
                                <div className="load">
                                    <LoadingCircle/>
                                </div>
                            ) : null }
                                <EditLoc
                                    refresh={() => this.refreshPage()}
                                    loadPage={() => this.load()}
                                    stopLoading={() => this.unLoad()}
                                    close={() => this.closeEdit()}
                                />
                            </div>
                        ) : null }
                        <Database
                            admin={this.state.admin}
                            refresh={this.state.refresh}
                            addUser={() => this.openAdd()}
                            addLoc={() => this.openLoc()}
                            editLoc={() =>this.openEdit()}
                            loadPage={() => this.load()}
                            img={(e) => this.openImg(e)}
                            stopLoading={() => this.unLoad()}
                            addEdit={(x,y) => this.openModal(x,y)}
                        />
                    </div>
                ) : (
                    <LoginPage
                        isLogedIn = {() => this.showSwal()}
                        admin = {(a) => this.isAdmin(a)}
                    />
                )}
            </div>
        )
    }
}

ReactDOM.render(
    <PlannerApp />, 
    document.getElementById('root')
);
