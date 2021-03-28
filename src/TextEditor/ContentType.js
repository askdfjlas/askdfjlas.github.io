const ContentType = Object.freeze({
  MATH: (1 << 0),
  BOLD: (1 << 1),
  ITALIC: (1 << 2),
  UNDERLINE: (1 << 3),
  STRIKETHROUGH: (1 << 4),
  IMAGE: (1 << 5)
});

export default ContentType;
