export const cls = (...classnames: string[]) => {
  return classnames.join(" ");
};

export const handleFetch = (url: string) =>
  fetch(url).then((res) => res.json());
