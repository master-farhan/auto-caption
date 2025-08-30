import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "./auth/Auth";
import axios from "axios";
import { motion } from "framer-motion";

const App = () => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState([null]);
  const [isUser, setIsUser] = useState(false);

  const apiUrl = "https://social-app-backend-5egu.onrender.com/api";

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/user`, {
          withCredentials: true,
        });
        setIsUser(!!response.data);
      } catch (error) {
        setIsUser(false);
      }
    };

    const fetchAllPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/posts/all`, {
          withCredentials: true,
        });
        if (response.data) setCaption(response.data);
      } catch (error) {
        console.error("Error fetching all posts:", error);
      }
    };

    checkUser();
    fetchAllPosts();
  }, []);

  return (
    <div className="min-h-screen relative p-5 sm:p-10 lg:px-15 max-w-8xl mx-auto">
      <div className="flex w-full justify-between items-center mb-5">
        <h1 className="text-2xl font-bold uppercase mb-5">
          AI Caption Gallery
        </h1>
        <button
          onClick={() => navigate("/profile")}
          className="cursor-pointer font-bold flex group"
        >
          <p className="opacity-0 group-hover:opacity-100 bg-white/80 text-black h-fit rounded-t-xl rounded-l-xl px-2 -mr-2 -mt-2">
            Profile
          </p>
          <img
            src="https://feedback.tracker.gg/uploads/default/original/2X/7/7ce3c97ee81a10a8379282d26f3c9b8cb9b5dfc8.png"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {isUser ? (
          caption.map((cap, index) => (
            <motion.div
              key={index}
              className="p-5 rounded shadow-[0_0_2px_#aaa] mb-5 bg-[#151414]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={cap?.image}
                alt={cap?.caption}
                className="w-full aspect-square object-cover rounded"
              />
              <p className="mt-2 text-sm">{cap?.caption}</p>
            </motion.div>
          ))
        ) : (
          <Auth isUser={isUser} setIsUser={setIsUser} />
        )}
      </div>
    </div>
  );
};

export default App;
