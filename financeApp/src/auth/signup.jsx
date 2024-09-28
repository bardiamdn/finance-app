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
import { useNavigate } from "react-router-dom";

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
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Username can only contain letters and numbers.",
    }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),
});

const SignupPage = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  function navigateLogin() {
    navigate("/login");
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
                    <Input
                      placeholder="Username"
                      maxLength={20}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^a-zA-Z0-9]/g,
                          ""
                        ); // Only allow alphanumeric
                        field.onChange(value);
                      }}
                    />
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
                    <Input
                      type="password"
                      placeholder="Password"
                      maxLength={30}
                      {...field}
                    />
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
        <p>Already have an account? </p>
        <Button variant="link" onClick={navigateLogin}>
          Log In
        </Button>
      </div>
    </div>
  );
};

export default SignupPage;
