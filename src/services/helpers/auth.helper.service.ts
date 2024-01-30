import { GuildMember, Message, PermissionsBitField } from "discord.js";

export default class AuthHelperService {
  static hasManageRolesPermission(user: GuildMember) {
    console.log(user);
    return user.permissions.has(PermissionsBitField.Flags.ManageRoles);
  }

  static hasTimeoutPermission(user: GuildMember) {
    console.log(user);
    return user.permissions.has(PermissionsBitField.Flags.ModerateMembers);
  }
}
