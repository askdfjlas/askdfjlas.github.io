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

    let anchorIndex = Number(anchorElement.getAttribute('index'));
    let focusIndex = Number(focusElement.getAttribute('index'));
    let anchorOffset = selection.anchorOffset;
    let focusOffset = selection.focusOffset;

    if(anchorIndex === focusIndex && anchorOffset === focusOffset) {
      return {
        rangeSelect: false,
        index: anchorIndex,
        position: anchorOffset
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
      rightPosition: focusOffset
    };
  }

  setPosition(index, position) {
    const blockElement = document.getElementById(this.id + index);
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
}

export default Caret;
