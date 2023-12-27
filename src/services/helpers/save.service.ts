import * as fs from "fs";

export default class SaveService {
  static loadChannelOwners() {
    return fs.readFileSync("./src/data/channel-owners.json", "utf-8");
  }

  static saveChannelOwners(data: string) {
    fs.writeFileSync("./src/data/channel-owners.json", data);
  }
}
