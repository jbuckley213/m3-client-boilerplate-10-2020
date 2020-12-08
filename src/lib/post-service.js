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
}

const postService = new PostService();

export default postService;
