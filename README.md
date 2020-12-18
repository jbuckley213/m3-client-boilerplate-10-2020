# Social Developer



## Description

A web app that is a social platform for developers. Developers can share idea, tutorials and memes thought posts. Other users can like and comment on these posts.

## User Stories

- **Sign Up** - As a user I would like to be able to sign up with my email.
- **Login** - As a user I would like to login with my email and password
- **Logout** - As a user I would want to be able to log out of my account so that no-one will have access to it and redirect to the login
- **HomePage ** - As a user I would like to see the posts of the people that I have followed. Also that I can like and comment on those posts. I would also like to be able to create posts myself
- **Search** - As a user I would search for other users that I would like to follow and start conversations with
- **Profile** - As a user I would like to see my profile page with the my posts, my likes and the people I follow. I would also like to be able to delete my posts
- **Post Details** - As a user I would the who has liked the post, see comments and also comment myself
- **Conversations** - As a user I would see a list of user I already have conversations with and see a preview of the last message.
- **Conversation Deatils** - As a user I would like to see a history of all the messages that another user and I have sent to eachother. Also be able to send new messages



## Backlog

- Refactor socket io to send messages
- Socket IO for real time updates of likes and comments
- Users can like comments
- Edit posts



# Client / Frontend

## React Router Routes (React App)

| Path                        | Component           | Permissions                | Behavior                                                     |
| --------------------------- | ------------------- | -------------------------- | ------------------------------------------------------------ |
| `/`                         | Cover Page          | public `<Route>`           | Home page                                                    |
| `/signup`                   | SignupPage          | anon only `<AnonRoute>`    | Signup form, link to login, navigate to homepage after signup |
| `/login`                    | LoginPage           | anon only `<AnonRoute>`    | Login form, link to signup, navigate to homepage after login |
| `/dashboard`                | DashboardPage       | user only `<PrivateRoute>` | Shows all posts by the other user they have followed. Also can make create a post themselves |
| `/search`                   | SearchPage          | user only `<PrivateRoute>` | Users can search for other users                             |
| `/profile/:id`              | ProfilePage         | user only `<PrivateRoute>` | Users can view their own profile or others profile with different admin prilvages |
| `/post/:id`                 | PostDetails         | user only `<PrivateRoute>` | Users can view posts with all comments below                 |
| `/conversations`            | ConversationList    | user only `<PrivateRoute>` | Users can view their conversations                           |
| `/conversation-details/:id` | ConversationDetails | user only `<PrivateRoute>` | Users can view the conversation details and send new messages |



## Components

- LoginPage
- SignupPage
- CoverPage
- DashboardPage
- SeachPage
- ProfilePage
- Posts
- SearchResults
- Navbar

## 

## Services

- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()
  - auth.me()
- User Service
  - user.getAll()
  - user.getOne(id)
  - user.follow(id)
  - user.unfollow(id)
  - user.deleteNotification(id)
  - user.seenNotification()
  - user.editPhoto(image)
  - user.darkview(darkMode)
- Posts
  - posts.getAllPostsByFollowedUsers()
  - posts.getById(id)
  - posts.createPost()
  - posts.delete(id)
  - posts.like(id)
  - posts.unlike(id)
  - posts.comment(id)
  - post.deleteComment(postId, commentId)



- Conversation
  - conversation.createConversation()
  - conversation.getConversations()
  - conversation.getConversationOne(conversationId)
  - conversation.sendMessage(conversationId, messageContent, userSentToId)
  - conversation.messageSeen()

# Server / Backend

## Models



User model

```
{
  firstName: String,
  lastName:String,
  email:{ type: String, unique: true, required: true },
  image: String,
  status:String,
  password: String,
  posts: [{type: ObjectId ref:"Post"}],
  followers: [{type: ObjectId ref:"User"}],
  following: [{type: ObjectId ref:"User"}],
  likes: [{type: ObjectId ref:"Post"}],
  notifications: [{type: Schema.Types.ObjectId, ref:"Notification"}],
  newNotification:Boolean,
  conversations: [{type: Schema.Types.ObjectId, ref:"Conversation"}],
  darkMode: {type: Boolean, default:false}


}
```



Post model

```
{
  postedBy: {type: ObjectId ref:"User"},
  postContent: String,
  postPhoto: String,  
  likes: [{type: ObjectId ref:"User"}],
  comments: [{type: ObjectId ref:"Comment"}],
  date: {type:Date, default:Date.now()}, 
 
}
```



Comments model

```
{
  createdBy: {type: ObjectId ref:"User"},
  commmentContent: String,
  post: {type: ObjectId ref:"Post"},
}
```

Conversation model

```
{
  users: [{type: Schema.Types.ObjectId, ref:"User"}],
  messages: [{type: Schema.Types.ObjectId, ref:"Message"}],
  notifications: [{type: Schema.Types.ObjectId, ref:"User"}]
}
```

Message model

```
{
  userSent: {type: Schema.Types.ObjectId, ref:"User"},
  conversation: {type: Schema.Types.ObjectId, ref:"Conversation"},
  messageContent: 'String',
}
```

Notification model

```
{
  userPost: {type: Schema.Types.ObjectId, ref:"User"},
  post: {type: Schema.Types.ObjectId, ref:"Post"},
  userActivity: {type: Schema.Types.ObjectId, ref:"User"},
  notificationInfo: {type:String, enum:['liked', 'commented','follow']},
}
```

## 

## API Endpoints (backend routes)

| HTTP Method | URL                       | Request Body                             | Success status | Error Status | Description                                                  |
| ----------- | ------------------------- | ---------------------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| GET         | `/auth/me`                | Saved session                            | 200            | 404          | Check if user is logged in and return user details           |
| POST        | `/auth/signup`            | {name, email, password}                  | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`             | {username, password}                     | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| POST        | `/auth/logout`            | (empty)                                  | 204            | 400          | Logs out the user                                            |
| GET         | `/api/users`              |                                          |                | 400          | Show all users for search                                    |
| GET         | `/api/users/:id`          | {id}                                     |                |              | Show user profile                                            |
| GET         | `/api/posts/`             |                                          |                |              | Get all posts from followed users                            |
| GET         | `/api/posts/:id`          |                                          |                |              | Get one individual post                                      |
| POST        | `/api/posts/`             | {postedBy, postContent, postPhoto, date} |                |              | Show user profile                                            |
| DELETE      | `/api/posts/:id`          | {id}                                     |                |              | Delete post by id                                            |
| PUT         | `/api/posts/:id/likes`    | {postId}                                 |                |              | User likes a post                                            |
| PUT         | `/api/posts/:id/unlikes`  | {postId}                                 |                |              | User unlikes a post                                          |
| POST        | `/api/posts/:id/comment`  | {createdBy, commentConent, post}         |                |              | Users creates a comment                                      |
| PUT         | `/api/users/:id/follow`   | {userId}                                 |                |              | Users follows another user                                   |
| PUT         | `/api/users/:id/unfollow` | {userId}                                 |                |              | Users unfollows antoher user                                 |



## Links

### Trello/Kanban

https://trello.com/b/ECv5VDs5/social-developer

### Git

The url to your repository and to your deployed project

[Client repository Link](https://github.com/screeeen/project-client)

[Server repository Link](https://github.com/screeeen/project-server)

[Deployed App Link](http://heroku.com/)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com/)