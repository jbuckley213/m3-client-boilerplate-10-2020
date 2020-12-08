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

  getAllPostsByFollowedUsers = () => {
    const pr = this.api.get("/posts");

    return pr;
  };

  createPost = (postedBy, postContent) => {
    const pr = this.api.post("/posts", { postedBy, postContent });
    return pr;
  };

  likePost = (postId) => {
    const pr = this.api.put(`/posts/${postId}/likes`);
    return pr;
  };
  unlikePost = (postId) => {
    const pr = this.api.put(`/posts/${postId}/unlikes`);
    return pr;
  };
}

const postService = new PostService();

export default postService;
