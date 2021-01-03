import React from "react";
import { Link } from "react-router-dom";
import SearchResult from "./../SeachResult/SearchResult";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";

import "./Popuplikes.css";

function PopupLikes(props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div onClick={props.toggleShowLikes} className="popup-likes-background">
        <div className="popup-likes">
          {props.likes.map((like) => {
            return (
              <Link to={`/profile/${like._id}`}>
                <div className="like-list">
                  <SearchResult userSearch={like} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default PopupLikes;
