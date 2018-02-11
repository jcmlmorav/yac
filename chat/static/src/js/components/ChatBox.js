import React from 'react';
import ChatMessage from './ChatMessage';
import {socket} from './Util.js';
import axios from 'axios';

class ChatBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            active: true
        };

        this.handleMessage = this.handleMessage.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.handleNewGif = this.handleNewGif.bind(this);
        this.handleGif = this.handleGif.bind(this);
        this.handleExit = this.handleExit.bind(this);
    }

    componentDidMount() {
        axios.get('/history')
        .then(response => response.data)
        .then(data => {
            let history = this.state.messages;
            for (message of data) {
                history.push({'message': message[2], 'username': message[1]});
                this.setState({messages: history});
                this.updateScroll();
            }
            socket.on('response', (data) => {
                let history = this.state.messages;
                history.push({'message': data.message, 'username': data.user});
                this.setState({messages: history});
                this.updateScroll();
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    updateScroll() {
        let element = document.getElementById("chat-container");
        element.scrollTop = element.scrollHeight;
    }

    handleMessage(event) {
        this.message = event.target.value;
    }

    handleGif(event) {
        this.gif = event.target.value;
    }

    handleNewMessage(event) {
        socket.emit('message', this.message, this.props.user);
        document.getElementById('message').value = '';
        event.preventDefault();
    }

    handleNewGif(event) {
        document.getElementById('gif').value = '';
        axios.get('http://api.giphy.com/v1/gifs/search', {
            params: {
                api_key: '8vhihCIIvQo7SyH0ImocdGUAotNo9fDT',
                q: this.gif,
                limit: 1
            }
        })
        .then(response => response.data.data[0])
        .then(gif => {
            socket.emit('message', '<iframe src="'+gif.embed_url+'" width="200" height="200" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>', this.props.user);
        })
        .catch(error => {
            console.log(error);
        });
        event.preventDefault();
    }

    handleExit() {
        localStorage.removeItem('yac_username');
        socket.emit('exit', this.props.user);
        this.setState({active: false});
    }

    render() {
        return (
            <div className="col-md-10">
                <div className="row justify-content-center">
                    <div id="chat-container" className="col-md-10 mt-3 mb-3 border pt-3 border-primary rounded">
                        <ul className="list-unstyled">
                            {this.state.messages.map((data, key) => {
                                return <ChatMessage username={data.username} message={data.message} key={key} />
                            })}
                        </ul>
                    </div>
                </div>
                <div className="row justify-content-center">
                    {this.state.active &&
                        <div className="col-md-10">
                            <form className="row align-items-center" onSubmit={this.handleNewMessage}>
                                <div className="col-md-10">
                                    <textarea placeholder="Type something..." className="form-control" onChange={this.handleMessage} id="message" name="message"></textarea>
                                </div>
                                <div className="col-md-2">
                                    <input className="btn btn-primary btn-block pt-4 pb-4" type="submit" value="Send" />
                                </div>
                            </form>
                            <form className="row align-items-center mt-2" onSubmit={this.handleNewGif}>
                                <div className="col-md-8">
                                    <input type="text" placeholder="Send an awesome gif!" className="form-control" onChange={this.handleGif} id="gif" name="gif" />
                                </div>
                                <div className="col-md-2">
                                    <input className="btn btn-primary btn-block" type="submit" value="Gif" />
                                </div>
                            </form>
                            <div className="row justify-content-center pt-5 pb-5">
                                <div className="col-md-3">
                                    <button className="btn btn-secondary btn-block" onClick={this.handleExit}>Exit</button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default ChatBox;
