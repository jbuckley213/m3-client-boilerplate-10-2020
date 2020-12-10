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

  getOne = (id) => {
    const pr = this.api.get(`/users/${id}`);
    return pr;
  };

  follow = (id) => {
    const pr = this.api.put(`/users/${id}/follow`);
    return pr;
  };

  unfollow = (id) => {
    const pr = this.api.put(`/users/${id}/unfollow`);
    return pr;
  };

  deleteNotification = (notificationId) => {
    const pr = this.api.put(`/users/notifications/${notificationId}`);
    return pr;
  };

  seenNotification = () => {
    const pr = this.api.get("/users/notifications/seen");
    return pr;
  };
}

const userService = new UserService();

export default userService;
