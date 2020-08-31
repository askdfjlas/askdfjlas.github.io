import React, { Component } from 'react';
import Api from './Api';

const REFRESH_TIMEOUT = 4000;

class MessageList extends Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };

    this.sendMessage = this.sendMessage.bind(this);
  }

  async refresh() {
    const messages = await Api.getMessages();
    this.setState({
      messages: messages
    });
  }

  async sendMessage() {
    const message = prompt('Say something');
    await Api.postMessage(message);
    this.refresh();
  }

  componentDidMount() {
    this.refresh();
    setInterval(() => {
      this.refresh();
    }, REFRESH_TIMEOUT);
  }

  render() {
    var messageElements = [];
    this.state.messages.forEach((message, i) => {
      const date = new Date(message.timestamp);
      messageElements.push(
        <p key={i}>
          <b>{ date.toString() } </b>
          { message.message }
        </p>
      );
    });

    return (
      <div className="Message-list">
        { messageElements }
        <button onClick={this.sendMessage}>Send Message</button>
      </div>
    );
  }
}

export default MessageList;
