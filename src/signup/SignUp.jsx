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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const password = watch("password");

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
    <div className="w-lg mx-auto mt-24 shadow-lg p-6 bg-white rounded-md">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <h2 className="text-forest-green uppercase text-center text-2xl md:col-span-2">Please Signup</h2>

        <fieldset disabled={isPending} className="contents">
          <Input
            label="Username"
            name="username"
            register={register}
            errors={errors}
            rules={{ required: "Username is required", minLength: { value: 5, message: "Min 5 characters" } }}
          />
          <Input label="First Name" name="firstName" register={register} errors={errors} rules={{ required: true }} />
          <Input label="Last Name" name="lastName" register={register} errors={errors} rules={{ required: true }} />
          <Input
            label="Email"
            name="email"
            register={register}
            errors={errors}
            rules={{
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
            }}
          />
          <Input label="City" name="city" register={register} errors={errors} rules={{ required: true }} />
          <Input label="Country" name="country" register={register} errors={errors} rules={{ required: true }} />

          <div className="md:col-span-2">
            <Input
              label="Password"
              name="password"
              type="password"
              register={register}
              errors={errors}
              rules={{ required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } }}
            />
          </div>

          <div className="md:col-span-2">
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
            />
          </div>

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
          />
        </fieldset>

        {error && <p className="text-red-500 md:col-span-2">{error}</p>}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="gradient-warm-sunset text-pale-lime transition w-full text-white py-2 px-4 cursor-pointer font-bold rounded-md disabled:opacity-50"
          >
            {isPending ? "Signing up..." : "Submit"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <small>Already have an account?</small>
        <Link to="/login" className="text-forest-green text-sm ml-2">
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUp;

// Updated reusable Input component
const Input = ({ label, name, type = "text", register, rules = {}, errors }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="font-semibold text-forest-green mb-1">
      {label}
    </label>
    <input
      type={type}
      id={name}
      {...register(name, rules)}
      className="p-2 w-full border rounded-md focus:outline-none"
    />
    {errors[name] && <span className="text-red-500 text-sm mt-1">{errors[name].message}</span>}
  </div>
);
