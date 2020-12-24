import MaskManager from './MaskManager';

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
  constructor(initialContent) {
    this.characters = [];
    this.globalCaretPosition = 0;

    if(initialContent) {
      for(const block of initialContent) {
        const mask = block.m;
        for(const char of block.c) {
          this.characters.push({
            m: mask,
            c: char
          });
        }
      }

      /* Remove extra newline character */
      this.characters.splice(this.characters.length - 1);
    }

    this.updateBlocks();
  }

  getIndexAndPosition(globalIndex) {
    let charactersScanned = 0;
    for(let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      const blockLength = countCharacters(block.c);
      const blockEndIndex = charactersScanned + blockLength;

      if(globalIndex <= blockEndIndex) {
        let position = 0;
        for(let j = charactersScanned; j <= blockEndIndex; j++) {
          if(globalIndex === j) {
            return [ i, position ];
          }
          position += this.characters[j].c.length;
        }
      }
      charactersScanned += blockLength;
    }

    return [ null, null ];
  }

  getGlobalIndex(index, position) {
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

  getCharacterMask(index, position, rangeSelect) {
    const globalIndex = this.getGlobalIndex(index, position);

    if(globalIndex === 0) {
      if(this.characters.length > 0)
        return this.characters[0].m;
      return 0;
    }
    else if(rangeSelect) {
      return this.characters[globalIndex].m;
    }
    return this.characters[globalIndex - 1].m;
  }

  insert(index, position, insertedString, mask) {
    const globalIndex = this.getGlobalIndex(index, position);
    const rightBuffer = this.characters.splice(globalIndex);

    for(const char of insertedString) {
      this.characters.push({
        m: mask,
        c: char
      });
    }

    const globalCaretPosition = this.characters.length;
    for(const character of rightBuffer) {
      this.characters.push(character);
    }

    this.updateBlocks();
    return this.getIndexAndPosition(globalCaretPosition);
  }

  delete(leftIndex, leftPosition, rightIndex, rightPosition) {
    const globalLeftIndex = this.getGlobalIndex(leftIndex, leftPosition);
    const globalRightIndex = this.getGlobalIndex(rightIndex, rightPosition);
    const deleteLength = globalRightIndex - globalLeftIndex;

    if(globalLeftIndex < 0) {
      return [ 0, 0 ];
    }

    this.characters.splice(globalLeftIndex, deleteLength);
    const globalCaretPosition = globalLeftIndex;

    this.updateBlocks();
    return this.getIndexAndPosition(globalCaretPosition);
  }

  rangeMaskUpdate(leftIndex, leftPosition, rightIndex, rightPosition, bit, on) {
    const globalLeftIndex = this.getGlobalIndex(leftIndex, leftPosition);
    const globalRightIndex = this.getGlobalIndex(rightIndex, rightPosition);

    for(let i = globalLeftIndex; i < globalRightIndex; i++) {
      this.characters[i].m = MaskManager.editorMergeBit(bit, on, this.characters[i].m);
    }

    this.updateBlocks();

    const [ newLeftIndex, newLeftPosition ] = this.getIndexAndPosition(globalLeftIndex);
    const [ newRightIndex, newRightPosition ] = this.getIndexAndPosition(globalRightIndex);
    return [ newLeftIndex, newLeftPosition, newRightIndex, newRightPosition ];
  }

  updateBlocks() {
    this.blocks = [];
    this.blockStarts = [];

    let currentMask = this.characters.length > 0 ? this.characters[0].m : 0;
    let characterBuffer = [];
    this.characters.forEach((character, i) => {
      if(character.m !== currentMask) {
        this.blocks.push({
          m: currentMask,
          c: characterBuffer.join('')
        });
        this.blockStarts.push(i - characterBuffer.length);

        currentMask = character.m;
        characterBuffer = [ character.c ];
      }
      else {
        characterBuffer.push(character.c);
      }
    });

    this.blocks.push({
      m: currentMask,
      c: characterBuffer.join('')
    });
    this.blockStarts.push(this.characters.length - characterBuffer.length);

    /* Extra 'empty' block for a potential caret position */
    this.blocks.push({
      m: 0,
      c: String.fromCharCode(8203)
    });

    /* Extra newline character sets correct caret positioning */
    this.blocks.push({
      m: 0,
      c: String.fromCharCode(10)
    });

    this.blockStarts.push(this.characters.length);
    this.blockStarts.push(this.characters.length);
  }

  getContent() {
    return this.blocks;
  }
}

export default VirtualTextEditor;
