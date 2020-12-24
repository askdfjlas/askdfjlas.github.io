import ContentType from './ContentType';

class MaskManager {
  static toolbarMergeBit(bit, on, originalMask) {
    if(bit === ContentType.MATH) {
      if(on) return bit;
      return 0;
    }
    else {
      if(originalMask & ContentType.MATH) {
        originalMask ^= ContentType.MATH;
      }
      return originalMask ^ bit;
    }
  }

  static editorMergeBit(bit, on, originalMask) {
    if(bit === ContentType.MATH) {
      if(on) return bit;

      if(originalMask & bit) originalMask ^= bit;
      return originalMask;
    }
    else {
      if(originalMask & ContentType.MATH) originalMask = 0;
      if(on) return originalMask | bit;

      if(originalMask & bit) originalMask ^= bit;
      return originalMask;
    }
  }
}

export default MaskManager;
