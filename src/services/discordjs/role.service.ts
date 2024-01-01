import { Guild, ColorResolvable, Role, Snowflake } from "discord.js";

class RoleService {
  private guild: Guild;

  constructor(guild: Guild) {
    this.guild = guild;
  }

  // Get a role by name
  getRoleByName(roleName: string): Role | undefined {
    return this.guild.roles.cache.find((role) => role.name === roleName);
  }

  // Get a role by ID
  getRoleById(roleId: Snowflake): Role | undefined {
    return this.guild.roles.cache.get(roleId);
  }

  // Add a role to a member
  async addRoleToMember(
    memberId: Snowflake,
    roleName: string
  ): Promise<boolean> {
    const member = this.guild.members.cache.get(memberId);
    const role = this.getRoleByName(roleName);

    if (member && role) {
      await member.roles.add(role);
      return true;
    }
    return false;
  }

  // Remove a role from a member
  async removeRoleFromMember(
    memberId: Snowflake,
    roleName: string
  ): Promise<boolean> {
    const member = this.guild.members.cache.get(memberId);
    const role = this.getRoleByName(roleName);

    if (member && role) {
      await member.roles.remove(role);
      return true;
    }
    return false;
  }

  // Check if a member has a specific role
  memberHasRole(memberId: Snowflake, roleName: string): boolean {
    const member = this.guild.members.cache.get(memberId);
    const role = this.getRoleByName(roleName);

    return role && member ? member.roles.cache.has(role.id) : false;
  }

  // Create a new role
  async createRole(roleName: string, color?: string): Promise<Role | null> {
    try {
      const validColor: ColorResolvable | undefined = color as ColorResolvable;
      const role = await this.guild.roles.create({
        name: roleName,
        color: validColor,
      });

      return role;
    } catch (error) {
      console.error("Error creating role:", error);
      return null;
    }
  }

  // Delete a role
  async deleteRole(roleName: string): Promise<boolean> {
    const role = this.getRoleByName(roleName);
    if (role) {
      await role.delete();
      return true;
    }
    return false;
  }

  // Other role management methods as needed...
}

export default RoleService;
