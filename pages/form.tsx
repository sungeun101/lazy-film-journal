import React from "react";
import { FieldErrors, useForm } from "react-hook-form";

interface LoginForm {
  username: string;
  password: string;
  email: string;
  submitted: boolean;
}

export default function Form() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitted, isDirty },
    setError,
    reset,
  } = useForm<LoginForm>({ mode: "onChange" });

  //   console.log(watch("email"));

  const onValid = () => {
    reset();
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      className="flex-col space-y-2 m-2"
    >
      <label className="block">
        Username:
        <input
          {...register("username", {
            required: "Please write down your username",
          })}
          type="text"
          placeholder="Username"
          className="border-2 rounded-md mx-2"
        />
        <span className="text-red-500 text-sm">{errors.username?.message}</span>
      </label>
      <label className="block">
        Email:
        <input
          {...register("email", {
            required: "Please write down your email",
            validate: {
              notGmail: (value) =>
                value.includes("naver.com") || "Only @naver email is allowed",
            },
          })}
          type="email"
          placeholder="Your naver email"
          className="border-2 rounded-md mx-2"
        />
        <span className="text-red-500 text-sm">{errors.email?.message}</span>
      </label>
      <label className="block">
        Password:
        <input
          {...register("password", {
            required: "Please write down your password",
            minLength: {
              message: "Your password should be at least 10 characters",
              value: 10,
            },
          })}
          type="text"
          placeholder="min 10 characters"
          className="border-2 rounded-md mx-2"
        />
        <span className="text-red-500 text-sm">{errors.password?.message}</span>
      </label>
      <label className="block">
        <input
          type="submit"
          value="Create Account"
          className="bg-blue-300 rounded-md p-1.5 cursor-pointer"
        />
        {isSubmitted && !isDirty && <span>Thank you!</span>}
      </label>
    </form>
  );
}
