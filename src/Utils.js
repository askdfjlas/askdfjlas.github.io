const MIN_PASSWORD_LENGTH = 6;

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

  static async checkPasswords(component, password, confirmPassword) {
    if(password !== confirmPassword) {
      await component.setError("Your passwords don't match!");
      return false;
    }

    if(password.length < MIN_PASSWORD_LENGTH) {
      await component.setError("Your password is too short!");
      return false;
    }

    return true;
  }
}

export default Utils;
