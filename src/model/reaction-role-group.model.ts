type MemberType = any; // Replace 'any' with the actual type of your members

class ReactionRoleGroupModel {
  name: string;
  message: string;
  members: MemberType[]; // Assuming 'members' is an array of a specific type
  inline: boolean;

  constructor(
    name: string,
    message: string,
    members: MemberType[],
    inline: boolean
  ) {
    this.name = name;
    this.message = message;
    this.members = members;
    this.inline = inline;
  }
}

export default ReactionRoleGroupModel;
