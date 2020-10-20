import Utils from '../Utils';

const MIN_PASSWORD_LENGTH = 6;

class HeaderUtils {
  static async checkPasswords(component, password, confirmPassword) {
    if(password !== confirmPassword) {
      await Utils.componentSetError(component, "Your passwords don't match!");
      return false;
    }

    if(password.length < MIN_PASSWORD_LENGTH) {
      await Utils.componentSetError(component, 'Your password is too short!');
      return false;
    }

    return true;
  }
}

export default HeaderUtils;
