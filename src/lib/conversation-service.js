import axios from "axios";

class PostService {
  constructor() {
    // this.api  is a reusable base of the request containing the base url (baseURL)
    // of the API and the options ( `withCredentials: true` )
    this.api = axios.create({
      baseURL: "http://localhost:5000/api",
      withCredentials: true,
    });
  }

  createConversation = (userId) => {
    const pr = this.api.post(`/conversations/${userId}`);

    return pr;
  };

  getConversations = () => {
    const pr = this.api.get(`/conversations`);
    return pr;
  };

  getConversationOne = (conversationId) => {
    const pr = this.api.get(`/conversations/${conversationId}`);
    return pr;
  };

  sendMessage = (conversationId, messageContent) => {
    const pr = this.api.post(`/conversations/${conversationId}/message`, {
      messageContent,
    });
    return pr;
  };
}

const postService = new PostService();

export default postService;
