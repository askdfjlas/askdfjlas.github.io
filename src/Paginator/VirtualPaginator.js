class VirtualPaginator {
  constructor(pageSize, content) {
    this.pageSize = pageSize;
    this.setContent(content);
  }

  setContent(content) {
    this.content = [];
    this.activeItems = content.length;

    for(let i = 0; i < content.length; i++) {
      let item = content[i];
      item.paginatorActive = true;
      this.content.push(item);
    }
  }

  toggleActiveItems(indices) {
    for(const index of indices) {
      const active = this.content[index].paginatorActive;
      this.content[index].paginatorActive = !active;

      if(active) {
        this.activeItems--;
      }
      else {
        this.activeItems++;
      }
    }
  }

  getContent(pageIndex) {
    let currentIndex = 1;
    let activeBufferSize = 0;
    let itemBuffer = [];

    for(const item of this.content) {
      itemBuffer.push(item);
      if(item.paginatorActive) {
        activeBufferSize++;
        if(activeBufferSize === this.pageSize) {
          if(currentIndex === pageIndex)
            return itemBuffer;
          itemBuffer = [];
          activeBufferSize = 0;
          currentIndex++;
        }
      }
    }

    if(currentIndex === pageIndex) {
      return itemBuffer;
    }

    throw Error('Page index out of range!');
  }

  getPageCount() {
    let pageCount = 0;
    let bufferSize = 0;
    let activeBufferSize = 0;
    for(const item of this.content) {
      if(bufferSize === 0) {
        pageCount++;
      }

      bufferSize++;
      if(item.paginatorActive) {
        activeBufferSize++;
      }
      if(activeBufferSize === this.pageSize) {
        activeBufferSize = 0;
        bufferSize = 0;
      }
    }

    return pageCount;
  }
}

export default VirtualPaginator;
