import axios from "axios";

class UserService {
  constructor() {
    // this.api  is a reusable base of the request containing the base url (baseURL)
    // of the API and the options ( `withCredentials: true` )
    this.api = axios.create({
      baseURL: "http://localhost:5000/api",
      withCredentials: true,
    });
  }

  getAll = () => {
    const pr = this.api.get("/users");

    return pr;
  };
}

const userService = new UserService();

export default userService;
