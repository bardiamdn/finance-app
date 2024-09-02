import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
const cfAuth = {
  clientId: import.meta.env.VITE_PUBLIC_CF_Access_Client_Id,
  clientSecret: import.meta.env.VITE_PUBLIC_CF_Access_Client_Secret,
};

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),
});

const SignupPage = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const setBearerToken = (token) => {
    localStorage.setItem("FinanceMadaniLabBearerToken", token);
  };

  async function onSignupSubmit(values) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);

    try {
      const response = await axios.post(apiUrl + "/auth/signup", values, {
        headers: {
          "Content-Type": "application/json",
          "CF-Access-Client-Id": cfAuth.clientId,
          "CF-Access-Client-Secret": cfAuth.clientSecret,
        },
      });
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  }

  function navigateLogin() {
    window.location.href = "/login";
  }
  return (
    <div className="main-auth">
      <div className="form">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Sign Up
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSignupSubmit)}
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
              onSubmit={onSignupSubmit}
            >
              Submit
            </LoadingButton>
          </form>
        </Form>
      </div>
      <div className="bottomBtn">
        <Button variant="secondary" onClick={navigateLogin}>
          Go to Log In page
        </Button>
      </div>
    </div>
  );
};

export default SignupPage;
