import colors from "colors";
import MessageService from "./message.service";
import MessageJSON from "./config.service";

enum MessageCode {
  SYSTEM = "system",
  SUCCESS = "success",
  ERROR = "error",
  DEBUG = "debug",
}

class LoggerService {
  private messageService: MessageService;

  constructor(messageService: MessageService) {
    this.messageService = messageService;

    if (!this.messageService.Messages) {
      throw new Error("MessageService is not properly initialized.");
    }
  }

  private logMessage(
    type: MessageCode,
    message: string,
    color: Function
  ): void {
    const prefix = this.messageService.Messages.logging.prefix[type];
    const logTime = new Date().toLocaleString("en-US");
    console.log(`${color(`<${prefix}>:`)} ${message} [${logTime}]`);
  }

  logSystem(message: string): void {
    this.logMessage(MessageCode.SYSTEM, message, colors.yellow);
  }

  logError(error: Error): void {
    if (error instanceof Error) {
      this.logMessage(MessageCode.ERROR, error.message, colors.red);
    }
  }

  logSuccess(message: string): void {
    this.logMessage(MessageCode.SUCCESS, message, colors.green);
  }
}

export default LoggerService;
