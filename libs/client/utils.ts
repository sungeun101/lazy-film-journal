import axios from "axios";

export const cls = (...classnames: string[]) => {
  return classnames.join(" ");
};

export const handleFetch = async (url: string) => {
  const res = await axios.get(url);
  return res;
};
