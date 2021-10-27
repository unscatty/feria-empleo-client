export const truncate = (text: string, size = 50) => {
  return text.length > size ? text.slice(0, size - 1) + '…' : text;
};
