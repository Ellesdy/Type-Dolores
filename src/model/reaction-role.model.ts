class ReactionRoleModel {
  roleName: string;
  emoji: string; // Change the type if 'emoji' is not a string.

  constructor(roleName: string, emoji: string) {
    this.roleName = roleName;
    this.emoji = emoji;
  }
}

export default ReactionRoleModel;
