import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

class Utils {
  static async setStatePromise(component, stateObject) {
    return new Promise((resolve, reject) => {
      if(component.mounted !== false) {
        component.setState(stateObject, () => {
          resolve();
        });
      }
      resolve();
    });
  }

  static isEmpty(object) {
    for(const property in object) {
      if(object.hasOwnProperty(property))
        return false;
    }
    return true;
  }

  static async componentSetError(component, message) {
    if(component.setError) {
      await component.setError(message);
    }
    else {
      await Utils.setStatePromise(component, {
        error: `Error: ${message}`
      });
    }
  }

  static async componentSetSuccess(component, message) {
    if(component.setSuccess) {
      await component.setSuccess(message);
    }
    else {
      await Utils.setStatePromise(component, {
        error: '',
        success: message
      });
    }
  }

  static convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      }
      reader.onerror = (err) => reject(err);
    });
  }

  /* Taken from dynamodbUtils.js in backend */
  static removePrefixZeroes(inputString) {
    let zeroCount = 0;
    for(let i = 0; i < inputString.length; i++) {
      if(inputString[i] !== '0') break;
      zeroCount++;
    }

    return inputString.substring(zeroCount, inputString.length);
  }

  static getTimeAgoString(timestamp) {
    const timeDate = new Date(timestamp);
    return timeAgo.format(timeDate);
  }

  static renderMathJax(selectors) {
    if(window.MathJax) {
      window.MathJax.typeset(selectors);
    }
  }
}

export default Utils;
