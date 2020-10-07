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
}

export default Utils;
