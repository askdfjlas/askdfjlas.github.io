const MESSAGE_PATH = 'https://2a0jyll2t9.execute-api.us-east-1.amazonaws.com/poc/messages';

class Api {
  static async getMessages() {
    const response = await fetch(MESSAGE_PATH);
    return await response.json();
  }

  static async postMessage(message) {
    const response = await fetch(`${MESSAGE_PATH}?message=${message}`, {
      method: 'POST'
    });
    return await response.json();
  }
}

export default Api;
