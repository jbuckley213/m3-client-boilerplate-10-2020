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

  getAllPostsByFollowedUsers = () => {
    const pr = this.api.get("/api/posts");

    return pr;
  };

  getById = (postId) => {
    const pr = this.api.get(`/api/posts/${postId}`);
    return pr;
  };

  createPost = (postedBy, postContent, postPhoto, code) => {
    console.log(postedBy, postContent, postPhoto, code);
    const pr = this.api.post("/api/posts", {
      postedBy,
      postContent,
      postPhoto,
      code,
    });
    return pr;
  };

  likePost = (postId) => {
    const pr = this.api.put(`/api/posts/${postId}/likes`);
    return pr;
  };
  unlikePost = (postId) => {
    const pr = this.api.put(`/api/posts/${postId}/unlikes`);
    return pr;
  };

  comment = (postId, commentContent) => {
    const pr = this.api.post(`/api/posts/${postId}/comment`, {
      commentContent,
    });
    return pr;
  };
  delete = (postId) => {
    const pr = this.api.delete(`/api/posts/${postId}/delete`);
    return pr;
  };

  deleteComment = (postId, commentId) => {
    const pr = this.api.delete(`/api/posts/${postId}/comment/${commentId}`);
    return pr;
  };
}

const postService = new PostService();

export default postService;
