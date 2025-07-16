import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import usePerson from "../hooks/usePerson";
import { authService, getImageUrl } from "../services/api";

const Login = () => {
  const { setUser } = usePerson();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormdata] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await authService.login(formData);
      if (res.data) {
        const currentUser = res.data.user;
        currentUser.photo = getImageUrl(currentUser.photo);
        setUser(res.data.user);
      }
      navigate("/");
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-3 bg-white shadow-lg rounded-md">
      <form onSubmit={handleSubmitLogin} className="space-y-4">
        <h2 className="text-2xl text-center text-forest-green uppercase">Please Login</h2>

        <fieldset disabled={isLoading} className="space-y-4">
          <>
            <label htmlFor="name" className="block text-forest-green font-semibold">
              Email
            </label>
            <input
              type="email"
              placeholder="eg. you@gmail.com"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInput}
              required
              className="w-full p-2 border rounded-md focus:outline-none"
            />
          </>

          <>
            <label htmlFor="password" className="block text-forest-green font-semibold">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInput}
              required
              className="w-full p-2 border rounded-md focus:outline-none"
            />
          </>
        </fieldset>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full gradient-warm-sunset text-pale-lime font-bold py-2 px-4 rounded-md transition disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Logging in..." : "Submit"}
        </button>
      </form>
      <div className="mt-5 flex justify-between items-center">
        <div>
          <small>Don't have an account?</small>
          <Link to="/signup" className="text-forest-green text-sm ml-2">
            SignUp
          </Link>
        </div>
        <div>
          <Link to="/forgot-password" className="text-forest-green text-sm">
            Forgot password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
