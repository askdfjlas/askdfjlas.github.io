function lessThan(a, b, c, d) {
  if(a === c)
    return b < d;
  return a < c;
}

class Caret {
  constructor(id) {
    this.id = id;
  }

  getInfo() {
    const selection = window.getSelection();
    let anchorElement = selection.anchorNode.parentElement;
    let focusElement = selection.focusNode.parentElement;

    let anchorMathBlock = this.getContainingMathBlock(anchorElement);
    let focusMathBlock = this.getContainingMathBlock(focusElement);
    if(anchorMathBlock) anchorElement = anchorMathBlock;
    if(focusMathBlock) focusElement = focusMathBlock;

    let anchorIndex = anchorElement.getAttribute('index');
    let focusIndex = focusElement.getAttribute('index');
    let anchorOffset = anchorElement.getAttribute('position');
    let focusOffset = focusElement.getAttribute('position');
    let insideCaretBlock = anchorElement.getAttribute('id') === 'Askd-te-CARET';

    if(anchorIndex === null || focusIndex === null) {
      return {
        rangeSelect: false,
        index: 0,
        position: 0,
        insideCaretBlock: false,
        editorSelected: true
      };
    }

    if(anchorOffset === null) anchorOffset = selection.anchorOffset;
    if(focusOffset === null) focusOffset = selection.focusOffset;

    anchorIndex = Number(anchorIndex);
    anchorOffset = Number(anchorOffset);
    focusIndex = Number(focusIndex);
    focusOffset = Number(focusOffset);

    if(anchorIndex === focusIndex && anchorOffset === focusOffset) {
      return {
        rangeSelect: false,
        index: anchorIndex,
        position: anchorOffset,
        insideCaretBlock: insideCaretBlock,
        editorSelected: true
      };
    }

    if(!lessThan(anchorIndex, anchorOffset, focusIndex, focusOffset)) {
      [ anchorIndex, focusIndex ] = [ focusIndex, anchorIndex ];
      [ anchorOffset, focusOffset ] = [ focusOffset, anchorOffset ];
    }

    return {
      rangeSelect: true,
      leftIndex: anchorIndex,
      leftPosition: anchorOffset,
      rightIndex: focusIndex,
      rightPosition: focusOffset,
      editorSelected: true
    };
  }

  setInfo(newCaretInfo) {
    if(newCaretInfo.rangeSelect) {
      this.removeCaretBlock();
      this.setRangePosition(
        newCaretInfo.leftIndex, newCaretInfo.leftPosition,
        newCaretInfo.rightIndex, newCaretInfo.rightPosition
      );
    }
    else if(newCaretInfo.insideCaretBlock) {
      this.addCaretBlock(newCaretInfo.index, newCaretInfo.position);
      this.setPosition(-1, 1);
    }
    else {
      this.removeCaretBlock();
      this.setPosition(newCaretInfo.index, newCaretInfo.position);
    }
  }

  setPosition(index, position) {
    let blockElement;
    if(index >= 0) {
      blockElement = document.getElementById(this.id + index);
    }
    else {
      blockElement = document.getElementById('Askd-te-CARET');
    }

    let textNode = blockElement.childNodes[0];
    if(!textNode) {
      textNode = document.createTextNode('');
      blockElement.appendChild(textNode);
    }

    let range = document.createRange();
    range.setStart(textNode, position);
    range.collapse(true);

    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  setRangePosition(leftIndex, leftPosition, rightIndex, rightPosition) {
    const leftBlockElement = document.getElementById(this.id + leftIndex);
    const rightBlockElement = document.getElementById(this.id + rightIndex);
    const leftTextNode = leftBlockElement.childNodes[0];
    const rightTextNode = rightBlockElement.childNodes[0];

    let range = document.createRange();
    range.setStart(leftTextNode, leftPosition);
    range.setEnd(rightTextNode, rightPosition);

    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  addCaretBlock(index, position) {
    this.removeCaretBlock();

    let caretBlock = document.createElement('div');
    caretBlock.setAttribute('id', 'Askd-te-CARET');
    caretBlock.setAttribute('index', index);
    caretBlock.setAttribute('position', position);
    caretBlock.innerHTML = String.fromCharCode(8203);

    let nextBlock = document.getElementById(this.id + (index + 1));
    nextBlock.parentElement.insertBefore(caretBlock, nextBlock);
  }

  removeCaretBlock() {
    let existingCaretBlock = document.getElementById('Askd-te-CARET');
    if(existingCaretBlock) {
      existingCaretBlock.parentElement.removeChild(existingCaretBlock);
      return true;
    }
    return false;
  }

  getContainingMathBlock(element) {
    while(element) {
      if(element.classList.contains('Askd-te-MATHJAX')) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }
}

export default Caret;
