// Adjust the import paths and the structure based on your actual JSON file contents and locations
import {
  ChannelJSON,
  ClientJSON,
  CommandJSON,
  MessageJSON,
  ReactionRoleJSON,
  RoleJSON,
  SystemJSON,
} from "../../repository/configRepository";

class ConfigService {
  [x: string]: any;
  public Channel = ChannelJSON;
  public Client = ClientJSON;
  public Command = CommandJSON;
  public Message = MessageJSON;
  public ReactionRole = ReactionRoleJSON;
  public Role = RoleJSON;
  public System = SystemJSON;

  constructor() {}

  public GetAllConfigs(): any[] {
    return [
      this.Channel,
      this.Client,
      this.Command,
      this.Message,
      this.ReactionRole,
      this.Role,
      this.System,
    ];
  }
}

export default ConfigService;
