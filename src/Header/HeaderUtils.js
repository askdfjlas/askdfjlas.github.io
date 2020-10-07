const MIN_PASSWORD_LENGTH = 6;

class HeaderUtils {
  static async checkPasswords(component, password, confirmPassword) {
    if(password !== confirmPassword) {
      await component.setError("Your passwords don't match!");
      return false;
    }

    if(password.length < MIN_PASSWORD_LENGTH) {
      await component.setError('Your password is too short!');
      return false;
    }

    return true;
  }
}

export default HeaderUtils;
