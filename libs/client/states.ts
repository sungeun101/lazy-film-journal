import { atom } from "recoil";

const homePathState = atom({
  key: "homePath",
  default: "/",
});
const archivePathState = atom({
  key: "archivePath",
  default: "/archive",
});

export { homePathState, archivePathState };
