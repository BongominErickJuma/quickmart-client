import React, { useState, useEffect } from "react";
import { authService, getImageUrl } from "../services/api";
import usePerson from "../hooks/usePerson";
import OptimizedImage from "../components/OptimizedImage";

const ProfilePage = () => {
  const { user, setUser } = usePerson();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phones: [{ number: "", type: "primary" }],
    city: "",
    country: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [passwordMessage, setPasswordMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        phones: user.phones?.length ? [...user.phones] : [{ number: "", type: "primary" }],
        city: user.city || "",
        country: user.country || "",
      });
      if (user.photo) {
        setPreviewUrl(user.photo);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPhones = [...formData.phones];
    updatedPhones[index] = { ...updatedPhones[index], [name]: value };
    setFormData((prev) => ({ ...prev, phones: updatedPhones }));
  };

  const addPhoneField = () => {
    setFormData((prev) => ({
      ...prev,
      phones: [...prev.phones, { number: "", type: "mobile" }],
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const form = new FormData();

    // Append string fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "phones") {
        form.append("phones", JSON.stringify(value)); // 👈 send as JSON string
      } else {
        form.append(key, value);
      }
    });

    // Append photo if selected
    if (photo) {
      form.append("photo", photo);
    }

    try {
      const res = await authService.updateMe(form); // ← this must handle multipart/form-data
      if (res.data) {
        const updatedUser = res.data.user;
        updatedUser.photo = getImageUrl(updatedUser.photo);
        setUser(updatedUser);
      }

      setMessage({ text: "Profile updated successfully!", type: "success" });
      setTimeout(() => {
        setMessage({ text: "", type: "success" });
      }, 5000);
    } catch (error) {
      console.error(error);
      setMessage({ text: error.message, type: "error" });
      setTimeout(() => {
        setMessage({ text: "", type: "error" });
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ text: "New passwords don't match", type: "error" });
      setTimeout(() => {
        setPasswordMessage({ text: "", type: "error" });
      }, 5000);
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({ text: "Password should be at least 8 characters", type: "error" });
      setTimeout(() => {
        setPasswordMessage({ text: "", type: "error" });
      }, 5000);
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        currentPassword: passwordData.currentPassword,
        password: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      };

      await authService.updatePassword(payload);

      setPasswordMessage({ text: "Password updated successfully!", type: "success" });
      setTimeout(() => {
        setPasswordMessage({ text: "", type: "success" });
      }, 5000);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordMessage({ text: error.message, type: "error" });
      setTimeout(() => {
        setPasswordMessage({ text: "", type: "error" });
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient flex items-start justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full animate-pulse-soft"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/20 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-white/8 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="max-w-6xl w-full p-6 pt-32 relative z-10">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-white/80">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Photo Section */}
          <div className="lg:col-span-1">
            <div className="glass-dark rounded-3xl p-8 shadow-glow animate-slide-in-up border border-purple-300/20">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="relative">
                    <OptimizedImage
                      src={previewUrl || "/default-profile.png"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-medium"
                      placeholderColor="bg-gradient-to-br from-purple-100 to-indigo-100"
                      eager={true}
                    />
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 cursor-pointer" />
                  </div>
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-2 right-2 bg-secondary hover:bg-indigo-700 text-white rounded-full p-3 cursor-pointer shadow-medium transition-all duration-200 hover:scale-110"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Profile Photo</h3>
                <p className="text-white/70 text-sm text-center">Click the camera icon to upload a new profile photo</p>
              </div>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="lg:col-span-3">
            {message.text && (
              <div className={`p-4 mb-6 rounded-xl shadow-soft animate-fade-in ${
                message.type === "success" 
                  ? "bg-green-50 text-green-800 border border-green-200" 
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                <div className="flex items-center">
                  {message.type === "success" ? (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {message.text}
                </div>
              </div>
            )}
            <div className="glass-dark rounded-3xl p-8 shadow-glow animate-slide-in-up border border-purple-300/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-white">
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your first name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-white">
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-white">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">@</span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                      placeholder="Your unique username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-primary">
                    Email Address
                  </label>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-surface border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-primary mb-3">
                    Phone Numbers
                  </label>
                  <div className="space-y-4">
                    {formData.phones.map((phone, index) => (
                      <div key={index} className="bg-surface-alt rounded-xl p-4 border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2 space-y-2">
                            <label htmlFor={`phone-${index}`} className="block text-xs font-medium text-secondary uppercase tracking-wide">
                              Phone Number
                            </label>
                            <div className="relative">
                              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <input
                                type="tel"
                                id={`phone-${index}`}
                                name="number"
                                value={phone.number}
                                onChange={(e) => handlePhoneChange(index, e)}
                                className="w-full pl-12 pr-4 py-3 bg-surface border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                placeholder="Enter phone number"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor={`type-${index}`} className="block text-xs font-medium text-secondary uppercase tracking-wide">
                              Type
                            </label>
                            <select
                              id={`type-${index}`}
                              name="type"
                              value={phone.type}
                              onChange={(e) => handlePhoneChange(index, e)}
                              className="w-full px-4 py-3 bg-surface border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                            >
                              <option value="primary">Primary</option>
                              <option value="mobile">Mobile</option>
                              <option value="home">Home</option>
                              <option value="work">Work</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addPhoneField}
                    className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-secondary bg-surface-alt border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Phone Number
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium text-primary">
                      City
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-surface border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="country" className="block text-sm font-medium text-primary">
                      Country
                    </label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-surface border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        placeholder="Enter your country"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Changes...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Password Update Section */}
            <div className="glass-dark rounded-3xl p-8 shadow-glow animate-slide-in-up border border-purple-300/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </h2>
              
              {passwordMessage.text && (
                <div className={`p-4 mb-6 rounded-xl shadow-soft animate-fade-in ${
                  passwordMessage.type === "success" 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  <div className="flex items-center">
                    {passwordMessage.type === "success" ? (
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {passwordMessage.text}
                  </div>
                </div>
              )}
              
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-primary">
                    Current Password
                  </label>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      placeholder="Enter current password"
                      autoComplete="current-password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-12 pr-4 py-3 bg-surface border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-primary">
                    New Password
                  </label>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-12 pr-4 py-3 bg-surface border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                  </div>
                  <p className="text-xs text-secondary mt-1">Password must be at least 8 characters long</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      autoComplete="confirm-password"
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-12 pr-4 py-3 bg-surface border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Password...
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
