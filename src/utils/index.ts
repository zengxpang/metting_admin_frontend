export const getRGBA = (color: string, alpha = 1): string => {
  if (![4, 7].includes(color?.length)) {
    return color;
  }
  const colors = color.slice(1);
  const size = colors.length / 3;
  const rgb = [];
  for (let i = 0; i < 3; i++) {
    let str = '';
    if (size === 1) {
      str = colors.slice(i, i + 1).repeat(2);
    } else {
      str = colors.slice(i * size, (i + 1) * size);
    }
    rgb.push(parseInt(str, 16));
  }
  return `rgb(${rgb.join(',')},${alpha})`;
};
