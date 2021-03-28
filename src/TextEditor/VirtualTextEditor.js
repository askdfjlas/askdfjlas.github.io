import MaskManager from './MaskManager';
import ContentType from './ContentType';

/* This is different from str.length; for example, emojis can use up 2 or more */
function countCharacters(str) {
  let counter = 0;
  for(const character of str) {
    Number(character);  // Silence unused variable linter warning
    counter++;
  }
  return counter;
}

class VirtualTextEditor {
  constructor(initialContent) {
    this.characters = [];
    this.caretBlockIndex = null;
    this.caretBlockPosition = null;

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

      /* Remove extra newline character if it exists */
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
    while(characterCounter < position && globalIndex < this.characters.length) {
      characterCounter += this.characters[globalIndex].c.length;
      globalIndex++;
    }

    if(characterCounter <= position)
      return globalIndex;

    return globalIndex - 1;
  }

  /* Visually identical caret positions can have two different indices
  and positions if it's in the middle of two blocks. This method returns the end
  position of the first block if rangeEnd is false and the starting position
  of the second block otherwise. */
  getCorrectedIndexAndPosition(index, position, rangeEnd, globalIndex=null) {
    if(globalIndex === null) {
      globalIndex = this.getGlobalIndex(index, position);
    }

    const firstBlockEnd = this.getIndexAndPosition(globalIndex);
    if(rangeEnd && globalIndex < this.characters.length) {
      const nextBlockGlobalIndex = this.getGlobalIndex(firstBlockEnd[0] + 1, 0);
      if(globalIndex === nextBlockGlobalIndex) {
        return [ firstBlockEnd[0] + 1, 0 ];
      }
    }
    return firstBlockEnd;
  }

  getCharacterMask(index, position, rangeSelect) {
    let globalIndex = this.getGlobalIndex(index, position);

    if(globalIndex === 0) {
      if(this.characters.length > 0)
        return this.characters[0].m;
      return 0;
    }
    else if(rangeSelect) {
      globalIndex = Math.min(globalIndex, this.characters.length - 1);
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

    this.caretBlockIndex = null;
    this.caretBlockPosition = null;

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

    this.caretBlockIndex = null;
    this.caretBlockPosition = null;

    this.updateBlocks();
    return this.getIndexAndPosition(globalCaretPosition);
  }

  rangeMaskUpdate(leftIndex, leftPosition, rightIndex, rightPosition, bit, on) {
    const globalLeftIndex = this.getGlobalIndex(leftIndex, leftPosition);
    const globalRightIndex = this.getGlobalIndex(rightIndex, rightPosition);

    for(let i = globalLeftIndex; i < globalRightIndex; i++) {
      this.characters[i].m = MaskManager.editorMergeBit(bit, on, this.characters[i].m);
    }

    this.caretBlockIndex = null;
    this.caretBlockPosition = null;
    this.updateBlocks();

    const [ newLeftIndex, newLeftPosition ] = this.getIndexAndPosition(globalLeftIndex);
    const [ newRightIndex, newRightPosition ] = this.getIndexAndPosition(globalRightIndex);
    return [ newLeftIndex, newLeftPosition, newRightIndex, newRightPosition ];
  }

  addCaretBlock(index, position) {
    this.caretBlockIndex = index;
    this.caretBlockPosition = position;
    this.updateBlocks();
  }

  /* Removes the caret block, and appropriately modifies caretInfo if provided */
  removeCaretBlock(caretInfo) {
    if(this.caretBlockIndex !== null) {
      this.caretBlockIndex = null;
      this.caretBlockPosition = null;

      if(caretInfo) {
        if(caretInfo.rangeSelect) {
          let leftGlobalIndex = this.getGlobalIndex(
            caretInfo.leftIndex, caretInfo.leftPosition
          );

          let rightGlobalIndex = this.getGlobalIndex(
            caretInfo.rightIndex, caretInfo.rightPosition
          );

          this.updateBlocks();

          [ caretInfo.leftIndex, caretInfo.leftPosition ] =
            this.getCorrectedIndexAndPosition(null, null, false, leftGlobalIndex);
          [ caretInfo.rightIndex, caretInfo.rightPosition ] =
            this.getCorrectedIndexAndPosition(null, null, true, rightGlobalIndex);
        }
        else {
          let globalIndex = this.getGlobalIndex(caretInfo.index, caretInfo.position);
          this.updateBlocks();
          [ caretInfo.index, caretInfo.position ] =
            this.getCorrectedIndexAndPosition(null, null, false, globalIndex);
        }
      }
      else {
        this.updateBlocks();
      }
    }
  }

  isEmpty() {
    return this.characters.length === 0;
  }

  /* Returns true if content is empty, or the caret position is at the end of
  a block and the last character is a newline. This is important for mobile. */
  atBlockNewlineEnd(index, position) {
    if(this.isEmpty()) return true;
    let content = this.blocks[index].c;
    if(content.length === position && content[position - 1] === String.fromCharCode(10))
       return true;
    return false;
  }

  updateBlocks() {
    this.blocks = [];
    this.blockStarts = [];

    let currentMask = this.characters.length > 0 ? this.characters[0].m : 0;
    let characterBuffer = [];
    let blockPosition = 0;
    this.characters.forEach((character, i) => {
      /* For math mode, replace newlines with spaces */
      if(character.m === ContentType.MATH && character.c === String.fromCharCode(10)) {
        character.c = ' ';
      }

      const caretBlockIncoming = (this.blocks.length === this.caretBlockIndex) &&
                                 (blockPosition === this.caretBlockPosition);
      const isImageBlock = (character.m === ContentType.IMAGE);

      /* End of this block */
      if(character.m !== currentMask || caretBlockIncoming || isImageBlock) {
        if(characterBuffer.length === 0) {
          currentMask = 0;
        }

        this.blocks.push({
          m: currentMask,
          c: characterBuffer.join('')
        });
        this.blockStarts.push(i - characterBuffer.length);

        blockPosition = character.c.length;
        currentMask = character.m;
        characterBuffer = [ character.c ];
      }
      else {
        characterBuffer.push(character.c);
        blockPosition += character.c.length;
      }
    });

    this.blocks.push({
      m: currentMask,
      c: characterBuffer.join('')
    });
    this.blockStarts.push(this.characters.length - characterBuffer.length);

    /* Extra newline character sets correct caret positioning */
    this.blocks.push({
      m: 0,
      c: String.fromCharCode(10)
    });

    this.blockStarts.push(this.characters.length);
  }

  getContent() {
    return this.blocks;
  }
}

export default VirtualTextEditor;
