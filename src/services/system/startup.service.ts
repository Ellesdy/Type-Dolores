// Import statements for the service classes
// Adjust these imports according to your actual project structure and the locations of these service classes
import ClientService from "../discordjs/client.service";
import LifecycleHelperService from "../helpers/lifecycle.helper.service";
import ValidationHelperService from "../helpers/validation.helper.service";
import CommandService from "../discordjs/command.service";

class StartupService {
  private clientService: ClientService;
  private lifecycleHelperService: LifecycleHelperService;
  private validationHelperService: ValidationHelperService;
  private commandService: CommandService;

  constructor(
    clientService: ClientService,
    lifecycleHelperService: LifecycleHelperService,
    validationHelperService: ValidationHelperService,
    commandService: CommandService
  ) {
    this.clientService = clientService;
    this.lifecycleHelperService = lifecycleHelperService;
    this.validationHelperService = validationHelperService;
    this.commandService = commandService;
  }

  async init(): Promise<void> {
    try {
      await this.validationHelperService.validateAll();
      await this.lifecycleHelperService.setupListeners();
      await this.clientService.login();
    } catch (error) {
      console.error("Error initializing services:", error);
    }
  }
}
export default StartupService;
