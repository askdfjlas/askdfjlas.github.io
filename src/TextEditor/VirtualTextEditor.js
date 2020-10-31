// This is different from str.length; for example emojis use up 2
function countCharacters(str) {
  let counter = 0;
  for(const character of str) {
    Number(character);  // Silence unused variable warning
    counter++;
  }
  return counter;
}

class VirtualTextEditor {
  constructor() {
    this.characters = [];
    this.globalCaretPosition = 0;
    this.updateBlocks();
  }

  getVirtualCaretIndex() {
    let charactersScanned = 0;
    for(let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      const blockLength = countCharacters(block.c);
      const blockEndIndex = charactersScanned + blockLength;

      if(this.globalCaretPosition <= blockEndIndex) {
        let position = 0;
        for(let j = charactersScanned; j <= blockEndIndex; j++) {
          if(this.globalCaretPosition === j) {
            return [ i, position ];
          }
          position += this.characters[j].c.length;
        }
      }
      charactersScanned += blockLength;
    }

    return [ null, null ];
  }

  getGlobalCaretIndex(index, position) {
    let globalIndex = this.blockStarts[index];
    let characterCounter = 0;
    while(characterCounter < position) {
      characterCounter += this.characters[globalIndex].c.length;
      globalIndex++;
    }

    if(characterCounter === position)
      return globalIndex;

    return globalIndex - 1;
  }

  insert(index, position, insertedString, mask) {
    const globalCharacterIndex = this.getGlobalCaretIndex(index, position);
    const characterMask = mask || this.blocks[index].m;

    const rightBuffer = this.characters.splice(globalCharacterIndex);
    for(const char of insertedString) {
      this.characters.push({
        m: characterMask,
        c: char
      });
    }

    this.globalCaretPosition = this.characters.length;
    for(const character of rightBuffer) {
      this.characters.push(character);
    }

    this.updateBlocks();
    return this.getVirtualCaretIndex();
  }

  delete(leftIndex, leftPosition, rightIndex, rightPosition) {
    const globalLeftIndex = this.getGlobalCaretIndex(leftIndex, leftPosition);
    const globalRightIndex = this.getGlobalCaretIndex(rightIndex, rightPosition);
    const deleteLength = globalRightIndex - globalLeftIndex;

    if(globalLeftIndex < 0) {
      return [ 0, 0 ];
    }

    this.characters.splice(globalLeftIndex, deleteLength);
    this.globalCaretPosition = globalLeftIndex;

    this.updateBlocks();
    return this.getVirtualCaretIndex();
  }

  updateBlocks() {
    if(this.characters.length === 0) {
      this.blocks = [
        { m: 0, c: '' }
      ];
      this.blockStarts = [ 0 ];

      return;
    }

    this.blocks = [];
    this.blockStarts = [];

    let currentMask = this.characters[0].m;
    let buffer = '';
    let bufferLength = 0;
    this.characters.forEach((character, i) => {
      if(character.m !== currentMask) {
        this.blocks.push({
          m: currentMask,
          c: buffer
        });
        this.blockStarts.push(i - bufferLength);

        currentMask = character.m;
        buffer = character.c;
        bufferLength = 1;
      }
      else {
        buffer += character.c;
        bufferLength++;
      }
    });

    this.blocks.push({
      m: currentMask,
      c: buffer
    });
    this.blockStarts.push(this.characters.length - bufferLength);

    /* Strange hack - extra newline character sets correct caret positioning;
       this extra character also somehow can't be selected */
    this.blocks[this.blocks.length - 1].c += String.fromCharCode(10);
  }

  getContent() {
    return this.blocks;
  }
}

export default VirtualTextEditor;
