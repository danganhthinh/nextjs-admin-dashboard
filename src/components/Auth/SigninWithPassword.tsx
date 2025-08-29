"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { signIn } from "@/services/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export default function SigninWithPassword() {
  const [data, setData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { accessToken, refreshToken, user } = await signIn({
        ...data,
        role: "USER",
      });

      if (accessToken && refreshToken) {
        const decodedAccessToken = jwt.decode(accessToken) as {
          exp?: number;
          iat?: number;
        };

        let maxAgeAccessToken = 0;
        if (decodedAccessToken?.exp && decodedAccessToken?.iat) {
          maxAgeAccessToken =
            (decodedAccessToken.exp - decodedAccessToken.iat) / (60 * 60 * 24); // in seconds
        }

        const decodedRefreshToken = jwt.decode(refreshToken) as {
          exp?: number;
          iat?: number;
        };

        let maxAgeRefreshToken = 0;
        if (decodedRefreshToken?.exp && decodedRefreshToken?.iat) {
          maxAgeRefreshToken =
            (decodedRefreshToken.exp - decodedRefreshToken.iat) /
            (60 * 60 * 24); // in seconds
        }

        Cookies.set("accessToken", accessToken, {
          path: "/",
          secure: true,
          sameSite: "strict",
          expires: maxAgeAccessToken,
        });
        Cookies.set("refreshToken", refreshToken, {
          path: "/",
          secure: true,
          sameSite: "strict",
          expires: maxAgeRefreshToken,
        });
      }

      console.log("pushhhhhhh");

      router.push("/");

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
