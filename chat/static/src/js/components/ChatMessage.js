import React from 'react';

class ChatMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ''
        };
    }

    createMarkup(html) {
        return {__html: html};
    }

    componentDidMount() {
        this.username = this.props.username;
        this.message = this.props.message;

        if( this.username == undefined ) {
            this.setState({
                message: <li className="text-center font-italic bg-info text-white pt-2 pb-2">{this.message}</li>
            });
        } else {
            this.setState({
                message: <li className="bg-light text-dark mt-2 mb-2 px-2">
                    <strong>{this.username}</strong> <span className="font-italic text-muted">says:</span>
                    <br />
                    <div dangerouslySetInnerHTML={this.createMarkup(this.message)}></div>
                </li>
            });
        }
    }

    render() {
        return(
            this.state.message
        )
    }
}

export default ChatMessage;
