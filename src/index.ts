import ServiceFactory from "./services/serviceFactory";

async function initializeServices() {
  try {
    const services = ServiceFactory.createServices();
    if (services.startupService && services.startupService.init) {
      await services.startupService.init();
      console.log("Startup service initialized successfully.");
    } else {
      console.error(
        "Startup service is not available or cannot be initialized."
      );
    }
  } catch (error) {
    console.error("Failed to initialize services:", error);
  }
}

initializeServices();
