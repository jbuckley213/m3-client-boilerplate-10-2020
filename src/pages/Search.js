import React, { Component, useState, useEffect } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";
import { Theme } from "./../styles/themes";
import SearchResult from "./../components/SeachResult/SearchResult";
import Post from "./../components/Posts/Post";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";

const Search = (props) => {
  // state = {
  //   users: [],
  //   searchResults: [],
  //   searchInput: "",
  // };

  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [searchPosts, setSearchPosts] = useState([]);
  const [searchPostsFirstThree, setSearchPostsFirstThree] = useState([]);
  const [seeMorePosts, setSeeMorePosts] = useState(false);
  const [showPosts, setShowPosts] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    userService
      .getAll()
      .then((apiResponse) => {
        // setUsers(apiResponse.data);
        filterSearch(apiResponse.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    handlePosts();
  }, [users]);

  const filterSearch = (listOfUsers) => {
    // const users = users;
    const filteredUsers = listOfUsers.filter((user) => {
      if (user._id === props.user._id) {
        return false;
      } else {
        return true;
      }
    });

    // this.setState({ users: filteredUsers, searchResults: filteredUsers });
    setUsers(filteredUsers);
    setSearchResults(filteredUsers);
  };

  const handlePosts = () => {
    const listOfPosts = [];
    users.map((user) => {
      listOfPosts.push(...user.posts);
    });

    setPosts(listOfPosts);
    setSearchPosts(listOfPosts);
  };

  const handleSearchResults = (value) => {
    // const { users } = this.state;

    const filteredUsers = users.filter((user) => {
      const lowercaseFirstName = user.firstName.toLowerCase();
      const lowercaseLastName = user.lastName.toLowerCase();
      const fullName = lowercaseFirstName + " " + lowercaseLastName;
      const lowercaseSearch = value.toLowerCase();

      if (
        lowercaseFirstName.startsWith(lowercaseSearch) ||
        lowercaseLastName.startsWith(lowercaseSearch) ||
        fullName.startsWith(lowercaseSearch)
      ) {
        return true;
      } else {
        return false;
      }
    });

    // this.setState({ searchResults: filteredUsers });
    setSearchResults(filteredUsers);
  };

  const handlePostSearchResults = (value) => {
    const filteredPosts = posts.filter((post) => {
      const lowercasePost = post.postContent.toLowerCase();
      const lowercaseSearch = value.toLowerCase();

      if (lowercasePost.includes(lowercaseSearch)) {
        return true;
      } else {
        return false;
      }
    });

    setSearchPosts(filteredPosts);
    const firstThreePosts = filteredPosts.splice(0, 3);
    setSearchPostsFirstThree(firstThreePosts);
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    handleSearchResults(value);
    handlePostSearchResults(value);
    // this.setState({ [name]: value });
    setSearchInput(value);
  };

  return (
    <Theme dark={props.isDark}>
      <div className="search">
        <h1>Search For A Fellow Developer</h1>
        <input
          className="input is-primary"
          name="searchInput"
          value={searchInput}
          onChange={handleInput}
          autoComplete="off"
        />
        {searchInput === "" ? null : (
          <div className="animated slideInUp search-content">
            <h1>People</h1>
            <table>
              <tbody className="search-table-body">
                {searchResults.length === 0 ? (
                  <p>Not results found</p>
                ) : (
                  searchResults.map((user) => {
                    return <SearchResult key={user._id} userSearch={user} />;
                  })
                )}
              </tbody>
            </table>

            <h1
              onClick={() => {
                setShowPosts(!showPosts);
              }}
            >
              Posts
            </h1>
            <AnimateSharedLayout>
              <AnimatePresence>
                {showPosts && (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {searchPostsFirstThree.map((post) => {
                      return (
                        <Post
                          key={post._id}
                          post={post}
                          searchWord={searchInput}
                        />
                      );
                    })}

                    <AnimatePresence>
                      {seeMorePosts ? (
                        <motion.div
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {searchPosts.map((post) => {
                            return (
                              <Post
                                key={post._id}
                                post={post}
                                searchWord={searchInput}
                              />
                            );
                          })}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                    <button
                      className="see-more-button"
                      onClick={() => setSeeMorePosts(!seeMorePosts)}
                    >
                      See More
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimateSharedLayout>
          </div>
        )}
      </div>
    </Theme>
  );
};

export default withAuth(Search);
