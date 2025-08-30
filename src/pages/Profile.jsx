import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const Navigate = useNavigate();

  const apiUrl = "https://social-app-backend-5egu.onrender.com/api";
  const [isUser, setIsUser] = useState(false);
  const [user, setUser] = useState("");
  const [myPosts, setMyPosts] = useState([]);

  // ✅ react-hook-form
  const { register, handleSubmit, reset, watch } = useForm();

  // ✅ Check User + Fetch Posts
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/user`, {
          withCredentials: true,
        });
        if (response.data?.user) {
          setIsUser(true);
          setUser(response.data.user.username);
        } else setIsUser(false);
      } catch {
        setIsUser(false);
        Navigate("/");
      }
    };

    const fetchMyPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/posts/my`, {
          withCredentials: true,
        });
        if (response.data) {
          setMyPosts(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching my posts:", error);
      }
    };

    checkUser();
    fetchMyPosts();
  }, []);

  // ✅ Create Post → caption backend থেকে আসবে
  const createPost = async (data) => {
    if (!data.file[0]) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("image", data.file[0]); // ✅ key = "image", value = file

    try {
      const response = await axios.post(`${apiUrl}/posts/create`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        reset(); // form clear
        setMyPosts((prev) => [response.data, ...prev]);
      }
    } catch (error) {
      console.error(
        "Error creating post:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen relative p-5 sm:p-10 lg:px-15 max-w-8xl mx-auto">
      {/* Username top-left */}
      <h1 className="lg:text-xl font-bold mb-6 drop-shadow-lg">
        {`Hi, ${user}`}
      </h1>

      {/* Upload Box */}
      <div className="bg-[#151414] rounded-2xl  shadow-[0_0_2px_#aaa] p-8 max-w-xl mx-auto my-12 lg:my-20">
        <h2 className="text-lg font-semibold mb-6 text-center drop-shadow-md">
          ✨ Auto Caption
        </h2>

        <form
          onSubmit={handleSubmit(createPost)}
          className="flex flex-col items-center space-y-4"
        >
          {/* Image preview box */}
          <div className="w-full h-44 bg-[#151414] rounded-xl flex items-center justify-center border-2 border-dashed border-[#aaa] overflow-hidden relative">
            {watch("file")?.[0] ? (
              <img
                src={URL.createObjectURL(watch("file")[0])}
                alt="Preview"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <FiUpload className="h-16 w-16 mb-2" />

                <p className="text-xs sm:text-sm">
                  Upload an image or select from dropdown
                </p>
              </div>
            )}
          </div>

          {/* File input */}
          <input
            type="file"
            accept="image/*"
            {...register("file")}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-600 file:text-white
                  hover:file:bg-indigo-700"
          />

          {/* Create Post Button */}
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
            type="submit"
          >
            Create Post
          </button>
        </form>
      </div>

      {/* My Posts */}
      <div className="relative mb-20">
        <h2 className="text-lg font-semibold mb-6">My Posts</h2>
        {myPosts.length === 0 ? (
          <p className="text-gray-400 text-center">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {myPosts.map((post) => (
              <div
                key={post._id}
                className="p-5 rounded mb-5 shadow-[0_0_2px_#aaa] bg-[#151414]"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full aspect-square object-cover rounded"
                  />
                )}
                <p className="mt-2 text-sm">{post.caption}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
