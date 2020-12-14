import axios from "axios";

class UserService {
  constructor() {
    // this.api  is a reusable base of the request containing the base url (baseURL)
    // of the API and the options ( `withCredentials: true` )
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      withCredentials: true,
    });
  }

  getAll = () => {
    const pr = this.api.get("/api/users");

    return pr;
  };

  getOne = (id) => {
    const pr = this.api.get(`/api/users/${id}`);
    return pr;
  };

  follow = (id) => {
    const pr = this.api.put(`/api/users/${id}/follow`);
    return pr;
  };

  unfollow = (id) => {
    const pr = this.api.put(`/api/users/${id}/unfollow`);
    return pr;
  };

  deleteNotification = (notificationId) => {
    const pr = this.api.put(`/api/users/notifications/${notificationId}`);
    return pr;
  };

  seenNotification = () => {
    const pr = this.api.get("/api/users/notifications/seen");
    return pr;
  };

  editPhoto = (image) => {
    console.log(image);
    const pr = this.api.post("/api/users/edit", { image });
    return pr;
  };

  darkView = (darkMode) => {
    const pr = this.api.post("/api/users/dark-mode", { darkMode });
    return pr;
  };
}

const userService = new UserService();

export default userService;
