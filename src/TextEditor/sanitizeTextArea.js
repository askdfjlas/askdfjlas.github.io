/* Manually sanitize text editor to ensure that it's consitent with content */
const sanitizeTextArea = (textEditor, content) => {
  let junkNodes = [];
  for(const node of textEditor.childNodes) {
    if(node.nodeType === Node.TEXT_NODE || node.nodeName === 'BR' ||
       node.nodeName === 'SPAN') {
      junkNodes.push(node);
    }
  }

  for(const node of junkNodes) {
    textEditor.removeChild(node);
  }

  for(let i = 0; i < content.length; i++) {
    let childElement = textEditor.children[i];

    const childIsMath = childElement.classList.contains('Askd-te-MATHJAX');
    const childIsImage = childElement.classList.contains('Askd-te-IMAGE');

    if(childIsMath || childIsImage) {
      continue;
    }

    if(childElement.innerHTML !== content[i].c) {
      childElement.childNodes[0].nodeValue = content[i].c;
    }
  }
};

export default sanitizeTextArea;
