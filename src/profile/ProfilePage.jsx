import React, { useState, useEffect } from "react";
import { authService, getImageUrl } from "../services/api";
import usePerson from "../hooks/usePerson";

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
    <div className="max-w-4xl mt-16 mx-auto p-6 bg-forest-green rounded-lg shadow-sm text-pale-lime">
      <h1 className="text-3xl font-bold mb-6 gradient-word">Profile Settings</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Photo Section */}
        <div className="md:col-span-1">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={previewUrl || "/default-profile.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-pale-lime"
              />
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 text-forest-green rounded-full p-2 cursor-pointer bg-green-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 " viewBox="0 0 20 20" fill="white">
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
            <p className="text-sm text-center">Click on the camera icon to upload a new profile photo</p>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="md:col-span-2">
          {message.text && (
            <div className={`p-3 mb-6 rounded-lg ${message.type === "success" ? "bg-green-800" : "bg-red-800"}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-dark-green border border-pale-lime rounded-md focus:outline-none focus:ring-2 focus:ring-pale-lime"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-dark-green border border-pale-lime rounded-md focus:outline-none focus:ring-2 focus:ring-pale-lime"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-dark-green border border-pale-lime rounded-md focus:outline-none focus:ring-2 focus:ring-pale-lime"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-dark-green border border-pale-lime rounded-md focus:outline-none focus:ring-2 focus:ring-pale-lime"
              />
            </div>

            <div>
              <label className="block mb-1">Phone Numbers</label>
              {formData.phones.map((phone, index) => (
                <div key={index} className="mb-3 flex items-end space-x-2">
                  <div className="flex-1">
                    <label htmlFor={`phone-${index}`} className="block text-sm mb-1">
                      Number
                    </label>
                    <input
                      type="text"
                      id={`phone-${index}`}
                      name="number"
                      value={phone.number}
                      onChange={(e) => handlePhoneChange(index, e)}
                      className="w-full px-3 py-2 bg-dark-green border border-pale-lime rounded-md focus:outline-none focus:ring-2 focus:ring-pale-lime"
                    />
                  </div>
                  <div className="w-32">
                    <label htmlFor={`type-${index}`} className="block text-sm mb-1">
                      Type
                    </label>
                    <select
                      id={`type-${index}`}
                      name="type"
                      value={phone.type}
                      onChange={(e) => handlePhoneChange(index, e)}
                      className="w-full px-3 py-2 bg-dark-green border border-pale-lime rounded-md focus:outline-none focus:ring-2 focus:ring-pale-lime"
                    >
                      <option value="primary">Primary</option>
                      <option value="mobile">Mobile</option>
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                    </select>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addPhoneField}
                className="px-4 py-2 bg-green-100 text-forest-green rounded-md hover:bg-green-200 cursor-pointer"
              >
                + Add Phone Number
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-dark-green border border-pale-lime rounded-md focus:outline-none focus:ring-2 focus:ring-pale-lime"
                />
              </div>
              <div>
                <label htmlFor="country" className="block mb-1">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-dark-green border border-pale-lime rounded-md focus:outline-none focus:ring-2 focus:ring-pale-lime"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full gradient-warm-sunset text-green-200 py-2 px-4 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {/* Password Update Section */}
          <div className="mt-8 pt-6 border-t border-pale-lime">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            {passwordMessage.text && (
              <div
                className={`p-3 mb-6 rounded-lg ${passwordMessage.type === "success" ? "bg-green-800" : "bg-red-800"}`}
              >
                {passwordMessage.text}
              </div>
            )}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="*******"
                  autoComplete="current-password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 bg-dark-green border border-pale-lime rounded-md focus:outline-none focus:ring-2 focus:ring-pale-lime"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="*******"
                  autoComplete="new-password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-pale-lime rounded-md focus:outline-none focus:ring-2 focus:ring-pale-lime"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="confirm-password"
                  placeholder="*******"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 bg-dark-green border border-pale-lime rounded-md focus:outline-none focus:ring-2 focus:ring-pale-lime"
                />
              </div>
              <button
                type="submit"
                className="w-full gradient-warm-sunset text-green-200 font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                {isLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
