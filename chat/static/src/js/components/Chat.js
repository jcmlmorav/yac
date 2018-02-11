import React from 'react';
import ChatBox from './ChatBox.js';
import {socket} from './Util.js';
import axios from 'axios';

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        };

        this.form = null;

        this.handleUsername = this.handleUsername.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    componentDidMount() {
        this.username = localStorage.getItem('yac_username');
        this.setState({user: this.username});
    }

    handleUsername(event) {
        this.username = event.target.value;
    }

    handleLogin(event) {
        axios.get('/user-exists/'+this.username)
        .then(response => response.data)
        .then(data => {
            if( data.length > 0 ) {
                alert("Username " + this.username + " has been taken, choose another one");
            } else {
                localStorage.setItem('yac_username', this.username);
                this.setState({user: this.username});
                socket.emit('joined', this.username);
            }
        })
        .catch(error => {
            console.log(error);
        });
        event.preventDefault();
    }

    render() {
        if( this.state.user == null ) {
            this.form = <form className="col-md-3" onSubmit={this.handleLogin}>
                <h3>Log in to chat!</h3>
                <div className="form-group">
                    <label htmlFor="username">
                        Username:
                        <input className="form-control" type="text" onChange={this.handleUsername} id="username" name="username" />
                    </label>
                </div>
                <input className="btn btn-primary mb-2" type="submit" value="Log in" />
            </form>;
        } else {
            this.form = <ChatBox user={this.username} />;
        }
        return(
            <div id="yac-component">
                <h1>YAC <small className="text-muted font-italic">Yet Another Chat</small></h1>
                <hr />
                <div className="row justify-content-center">
                    {this.form}
                </div>
            </div>
        )
    }
}

export default Chat;
