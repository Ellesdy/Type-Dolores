import { GuildMember, PermissionsBitField } from "discord.js";

export default class AuthHelperService {
  static hasManageRolesPermission(user: GuildMember) {
    console.log(user);
    return user.permissions.has(PermissionsBitField.Flags.ManageRoles);
  }
}
