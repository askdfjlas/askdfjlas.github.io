class Utils {
  static async setStatePromise(component, stateObject) {
    return new Promise((resolve, reject) => {
      component.setState(stateObject, () => {
        resolve();
      });
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
}

export default Utils;
