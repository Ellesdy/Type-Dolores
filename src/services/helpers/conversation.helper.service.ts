import ConversationCacheModel from "../../model/conversationCacheModel";

// Assuming 'messageObj' is of a specific type, you should replace 'any' with the actual type
class ConversationHelperServicer {
  private conversationCache: ConversationCacheModel;

  constructor() {
    this.conversationCache = new ConversationCacheModel();
  }

  getConversation(userId: string): any[] | null {
    return this.conversationCache.get(userId);
  }

  async updateConversation(userId: string, messageObj: any): Promise<void> {
    let conversation = (await this.getConversation(userId)) || [];
    conversation.push(messageObj);
    if (conversation.length > 9) {
      conversation.shift();
    }
    this.conversationCache.set(userId, conversation);
  }
}

export default ConversationHelperServicer;
