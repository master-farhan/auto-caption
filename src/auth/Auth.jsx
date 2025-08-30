import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Auth = ({ isUser, setIsUser }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Initial page loading
  const [isLoading, setIsLoading] = useState(true);

  // Auth success er por loading
  const [authLoading, setAuthLoading] = useState(false);

  const navigate = useNavigate();

  setTimeout(() => {
    if (isLoading) setIsLoading(false);
  }, 1000);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const apiUrl = "https://social-app-backend-5egu.onrender.com/api";

  const onSubmit = async (data) => {
    try {
      let res;

      if (isLoginMode) {
        res = await axios.post(`${apiUrl}/auth/login`, data, {
          withCredentials: true,
        });
        console.log("Login Success:", res.data);
      } else {
        res = await axios.post(`${apiUrl}/auth/register`, data, {
          withCredentials: true,
        });
        console.log("Register Success:", res.data);
      }

      if (res.status === 200 || res.status === 201) {
        // show loading spinner after success
        setAuthLoading(true);

        setTimeout(() => {
          setIsUser(true);
          navigate("/profile"); // redirect user
        }, 1200); // loading time before going to profile
      }
    } catch (error) {
      console.error("Auth Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md">
      {/* Initial Loading */}
      {isLoading && (
        <div className="fixed h-screen w-screen flex items-center justify-center bg-[#0f0f0f] z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="text-white text-lg font-semibold tracking-wide animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      )}

      {/* Auth Success Loading */}
      {authLoading && (
        <div className="fixed h-screen w-screen flex items-center justify-center bg-[#0f0f0f] z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-green-400 border-t-white rounded-full animate-spin"></div>
            <p className="text-green-400 text-lg font-semibold tracking-wide animate-pulse">
              Redirecting to profile...
            </p>
          </div>
        </div>
      )}

      {/* Auth Form */}
      {!authLoading && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-transparent rounded-2xl shadow-xl p-5 w-[90%] sm:w-[400px] relative"
        >
          <h1 className="text-2xl font-bold text-center mb-5 text-indigo-700">
            {isLoginMode ? "Login" : "Register"}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters required" },
                })}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password (Only Register) */}
            <AnimatePresence>
              {!isLoginMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                    })}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
              type="submit"
            >
              {isLoginMode ? "Login" : "Register"}
            </motion.button>
          </form>

          {/* Toggle */}
          <p className="text-center mt-4 text-sm text-gray-600">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-indigo-700 font-semibold hover:underline"
            >
              {isLoginMode ? "Register" : "Login"}
            </button>
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Auth;
