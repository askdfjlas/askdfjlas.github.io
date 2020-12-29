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
    const anchorElement = selection.anchorNode.parentElement;
    const focusElement = selection.focusNode.parentElement;

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

  setInfo(caretInfo) {
    if(caretInfo.rangeSelect) {
      this.setRangePosition(
        caretInfo.leftIndex, caretInfo.leftPosition,
        caretInfo.rightIndex, caretInfo.rightPosition
      );
    }
    else if(caretInfo.insideCaretBlock) {
      this.setPosition(-1, 0);
    }
    else {
      this.setPosition(caretInfo.index, caretInfo.position);
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

    let indexBlock = document.getElementById(this.id + index);
    let currentIndex = 0;
    let leftBuffer = [];
    let rightBuffer = [];
    for(const character of indexBlock.innerHTML) {
      if(currentIndex < position) {
        leftBuffer.push(character);
      }
      else {
        rightBuffer.push(character);
      }
      currentIndex += character.length;
    }

    let nextBlock = document.getElementById(this.id + (index + 1));
    let nextBlockParent = nextBlock.parentElement;
    if(rightBuffer.length > 0) {

    }
    else {
      nextBlockParent.insertBefore(caretBlock, nextBlock);
    }
  }

  removeCaretBlock() {
    let existingCaretBlock = document.getElementById('Askd-te-CARET');
    if(existingCaretBlock) {
      existingCaretBlock.parentElement.removeChild(existingCaretBlock);
      return true;
    }
    return false;
  }
}

export default Caret;
