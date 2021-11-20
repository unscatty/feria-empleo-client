export const truncate = (text: string, size = 50) => {
  return text.length > size ? text.slice(0, size - 1) + '…' : text;
};

export const splitAtIndex = (text: string, index: number): [string, string] => {
  return [text.substring(0, index), text.substring(index)];
};

export const splitAt = (text: string, separator: string): [string, string] => {
  if (separator === '') return [text, ''];

  const lastIndexOfSeparator = text.lastIndexOf(separator);

  if (lastIndexOfSeparator === -1) return [text, ''];

  return splitAtIndex(text, lastIndexOfSeparator);
};

export const filenameAndExtension = (filename: string, separator = '.') =>
  splitAt(filename, separator);
