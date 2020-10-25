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
      if(this.globalCaretPosition <= charactersScanned + block.c.length) {
        return [ i, this.globalCaretPosition - charactersScanned ];
      }
      charactersScanned += block.c.length;
    }

    return [ null, null ];
  }

  insert(index, position, insertedString, mask) {
    const globalCharacterIndex = this.blockStarts[index] + position;
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
    const globalLeftIndex = this.blockStarts[leftIndex] + leftPosition;
    const globalRightIndex = this.blockStarts[rightIndex] + rightPosition;
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
    this.characters.forEach((character, i) => {
      if(character.m !== currentMask) {
        this.blocks.push({
          m: currentMask,
          c: buffer
        });
        this.blockStarts.push(i - buffer.length);

        currentMask = character.m;
        buffer = character.c;
      }
      else {
        buffer += character.c;
      }
    });

    this.blocks.push({
      m: currentMask,
      c: buffer
    });
    this.blockStarts.push(this.characters.length - buffer.length);
  }

  getContent() {
    return this.blocks;
  }
}

export default VirtualTextEditor;
