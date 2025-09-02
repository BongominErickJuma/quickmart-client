import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService, getImageUrl } from "../services/api";
import usePerson from "../hooks/usePerson";
import { useForm } from "react-hook-form";

const SignUp = () => {
  const navigate = useNavigate();
  const { setUser } = usePerson();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const nextStep = async () => {
    const step1Fields = ["username", "firstName", "lastName", "email"];
    const isStep1Valid = await trigger(step1Fields);

    if (isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const onSubmit = async (data) => {
    setError("");
    setIsPending(true);

    const payload = {
      ...data,
      phones: [
        { number: data.primaryPhone, type: "primary" },
        { number: data.mobilePhone, type: "mobile" },
      ],
    };

    delete payload.primaryPhone;
    delete payload.mobilePhone;

    try {
      const res = await authService.signup(payload);
      if (res.data) {
        const newUser = res.data.user;
        newUser.photo = getImageUrl(newUser.photo);
        setUser(newUser);
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full animate-pulse-soft"></div>
        <div
          className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/20 rounded-full animate-bounce-gentle"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-32 h-32 bg-white/8 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-2xl w-full glass-dark rounded-3xl shadow-glow p-10 border border-purple-300/20 animate-slide-in-up relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-glow magnetic">
            <svg
              className="w-10 h-10 text-white animate-pulse-soft"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 gradient-text-accent animate-glow">
            {currentStep === 1 ? "Welcome!" : "Almost Done!"}
          </h2>
          <p className="text-white/80 animate-slide-in-up stagger-1">
            {currentStep === 1 ? "Let's create your account - Step 1 of 2" : "Complete your profile - Step 2 of 2"}
          </p>

          {/* Progress indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentStep >= 1 ? "bg-gradient-primary animate-pulse-soft" : "bg-white/30"
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentStep >= 2 ? "bg-gradient-primary animate-pulse-soft" : "bg-white/30"
              }`}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isPending} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-slide-in-right">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Username"
                    name="username"
                    register={register}
                    errors={errors}
                    rules={{ required: "Username is required", minLength: { value: 5, message: "Min 5 characters" } }}
                    isDark={true}
                  />
                  <Input
                    label="Email"
                    name="email"
                    register={register}
                    errors={errors}
                    rules={{
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                    }}
                    isDark={true}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    name="firstName"
                    register={register}
                    errors={errors}
                    rules={{ required: "First name is required" }}
                    isDark={true}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    register={register}
                    errors={errors}
                    rules={{ required: "Last name is required" }}
                    isDark={true}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button type="button" onClick={nextStep} className="btn btn-primary px-8 py-3 ripple magnetic">
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Additional Details & Password */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-slide-in-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="City"
                    name="city"
                    register={register}
                    errors={errors}
                    rules={{ required: "City is required" }}
                    isDark={true}
                  />
                  <Input
                    label="Country"
                    name="country"
                    register={register}
                    errors={errors}
                    rules={{ required: "Country is required" }}
                    isDark={true}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Primary Phone"
                    name="primaryPhone"
                    register={register}
                    errors={errors}
                    rules={{
                      required: "Primary phone is required",
                      pattern: {
                        value: /^(\+|\b0)\d{8,}$/,
                        message: "Invalid phone number format",
                      },
                    }}
                    isDark={true}
                  />
                  <Input
                    label="Mobile Phone"
                    name="mobilePhone"
                    register={register}
                    errors={errors}
                    rules={{
                      required: "Mobile phone is required",
                      pattern: {
                        value: /^(\+|\b0)\d{8,}$/,
                        message: "Invalid phone number format",
                      },
                    }}
                    isDark={true}
                  />
                </div>

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  register={register}
                  errors={errors}
                  rules={{ required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } }}
                  isDark={true}
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  register={register}
                  errors={errors}
                  rules={{
                    required: "Please confirm your password",
                    validate: (val) => val === password || "Passwords do not match",
                  }}
                  isDark={true}
                />

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20 px-8 py-3"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center ripple magnetic"
                  >
                    {isPending ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      "Create Account ✨"
                    )}
                  </button>
                </div>
              </div>
            )}
          </fieldset>

          {error && (
            <div className="bg-red-500/20 border border-red-300/50 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <span className="text-white/60 text-sm">Already have an account? </span>
          <Link to="/login" className="text-white/90 font-medium hover:text-white transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

// Updated reusable Input component
const Input = ({ label, name, type = "text", register, rules = {}, errors, isDark = false }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-primary"}`}>
      {label}
    </label>
    <input
      type={type}
      id={name}
      {...register(name, rules)}
      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 ${
        isDark
          ? "bg-white/10 border-white/20 text-white placeholder-white/50 focus:bg-white/20"
          : "border-gray-300 bg-gray-50 focus:bg-white"
      }`}
    />
    {errors[name] && (
      <div className="flex items-center mt-2">
        <svg className="w-4 h-4 text-red-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
        </svg>
        <span className={`text-sm ${isDark ? "text-red-300" : "text-red-600"}`}>{errors[name].message}</span>
      </div>
    )}
  </div>
);
