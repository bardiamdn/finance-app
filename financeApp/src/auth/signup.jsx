import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { LoadingButton } from '@/components/ui/loading-button';
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
import axios from 'axios';

import './auth.css';

const apiUrl = 'https://api.madanilab.site';
// const apiUrl = 'https://192.168.1.111:3000';

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
		password: ""
		},
	});

	
	const setBearerToken = (token) => {
		localStorage.setItem('FinanceMadaniLabBearerToken', token);
	};

	async function onSignupSubmit(values) {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 5000);

		console.log(values);
	
		try {
			const response = await axios.post(apiUrl+'/auth/signup', values, {
				headers: {
					'Content-Type': 'application/json',
					'CF-Access-Client-Id': '06b0630f66b18f473a617819261e2e6a.access',
					'CF-Access-Client-Secret': '2554796ee90aee81b35787f4d427b86bd1d0cece38c6d9d8bee9336b88b52eb6'
				},
			});
			console.log(response)
			window.location.href = "/login";
		} catch (error) {
			console.log(error)
		}
	}

	function navigateLogin() {
		window.location.href = "/login";
	};
  return (
	<div className="main-auth">
			<div className="form">
				<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0" >Sign Up</h2>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSignupSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder="Username" {...field} />
								</FormControl>
								<FormMessage>{form.formState.errors.username?.message}</FormMessage>
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
								<FormMessage>{form.formState.errors.password?.message}</FormMessage>
								</FormItem>
							)}
						/>
						<LoadingButton type="submit" loading={loading} onSubmit={onSignupSubmit}>Submit</LoadingButton>
					</form>
				</Form>
			</div>
			<div className="bottomBtn">
				<Button variant='secondary' onClick={navigateLogin}>Go to Log In page</Button>
			</div>
	</div>
  );
};

export default SignupPage;
