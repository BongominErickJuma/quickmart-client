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
    <div className="min-h-screen animated-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full animate-pulse-soft"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/20 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-md w-full glass-dark rounded-3xl shadow-glow p-10 border border-purple-300/20 animate-slide-in-up relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-glow magnetic">
            <svg className="w-10 h-10 text-white animate-pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
          <p className="text-white/80 animate-slide-in-up stagger-1">Sign in to your account and continue shopping</p>
        </div>
        <form onSubmit={handleSubmitLogin} className="space-y-6">

          <fieldset disabled={isLoading} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInput}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInput}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </fieldset>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">
              <span className="text-secondary text-sm">Don't have an account? </span>
              <Link to="/signup" className="text-secondary font-medium hover:text-primary transition-colors">
                Sign up
              </Link>
            </div>
            <Link to="/forgot-password" className="text-secondary text-sm hover:text-primary transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
