import axios from "axios";

class PostService {
  constructor() {
    // this.api  is a reusable base of the request containing the base url (baseURL)
    // of the API and the options ( `withCredentials: true` )
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      withCredentials: true,
    });
  }

  createConversation = (userId) => {
    const pr = this.api.post(`/api/conversations/${userId}`);

    return pr;
  };

  getConversations = () => {
    const pr = this.api.get(`/api/conversations`);
    return pr;
  };

  getConversationOne = (conversationId) => {
    const pr = this.api.get(`/api/conversations/${conversationId}`);
    return pr;
  };

  sendMessage = (conversationId, messageContent, userSentToId) => {
    const pr = this.api.post(`/api/conversations/${conversationId}/message`, {
      messageContent,
      userSentToId,
    });
    return pr;
  };

  messageSeen = (conversationId) => {
    const pr = this.api.get(
      `/api/conversations/${conversationId}/message-seen`
    );
    return pr;
  };

  deleteMessage = (conversationId, messageId) => {
    const pr = this.api.delete(
      `/api/conversations/${conversationId}/message/${messageId}`
    );

    return pr;
  };
}

const postService = new PostService();

export default postService;
