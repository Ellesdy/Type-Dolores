type Conversation = any; // Replace 'any' with the actual type of your conversation objects

class ConversationCache {
  private cache: Map<string, Conversation>;

  constructor() {
    this.cache = new Map<string, Conversation>();
  }

  get(userId: string): Conversation | undefined {
    return this.cache.get(userId);
  }

  set(userId: string, conversation: Conversation): void {
    this.cache.set(userId, conversation);
  }
}

export default ConversationCache;
