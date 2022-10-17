import { atom } from "recoil";

const homePathState = atom({
  key: "homePath",
  default: "/",
});
const archivePathState = atom({
  key: "archivePath",
  default: "/archive",
});
const showSearchResultState = atom({
  key: "showSearchResult",
  default: false,
});

export { homePathState, archivePathState, showSearchResultState };
