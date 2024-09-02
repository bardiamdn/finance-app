import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, redirect } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";

import "./auth.css";

const mode = import.meta.env.VITE_MODE;
const apiUrl =
  mode === "production"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV;

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),
});

// Routing the user to the right route is mainly done in the App.jsx file
const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const setLocalStorage = (token, userId, username) => {
    localStorage.setItem("FinanceMadaniLabBearerToken", token);
    localStorage.setItem("FinanceMadaniLabUserId", userId);
    localStorage.setItem("FinanceMadaniLabUsername", username);
  };

  async function onLoginSubmit(values) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);

    console.log("access", import.meta.env.VITE_PUBLIC_CF_ACCESS_CLIENT_ID);
    await axios
      .post(apiUrl + "/auth/login", values, {
        headers: {
          "Content-Type": "application/json",
          "CF-Access-Client-Id": import.meta.env
            .VITE_PUBLIC_CF_ACCESS_CLIENT_ID,
          "CF-Access-Client-Secret": import.meta.env
            .VITE_PUBLIC_CF_ACCESS_CLIENT_SECRET,
        },
      })
      .then((response) => {
        // console.log(response);
        // const userId = response.
        let token = response.data.token;
        token = token.split(" ")[1];
        setLocalStorage(token, response.data.userId, response.data.username);

        // return (window.location.href = "/home");
        redirect("/home");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  }

  function navigateSignup() {
    window.location.href = "/signup";
  }
  return (
    <div className="main-auth">
      <div className="form">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Log In
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onLoginSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.username?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <LoadingButton
              type="submit"
              loading={loading}
              onSubmit={onLoginSubmit}
            >
              Submit
            </LoadingButton>
          </form>
        </Form>
      </div>
      <div className="bottomBtn">
        <Button variant="secondary" onClick={navigateSignup}>
          Go to Sign Up page
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
