import { useEffect, useState, useLayoutEffect } from 'react'
import axios from 'axios'
import './App.css'
import { BrowserRouter as Router, Route, Navigate, Routes, Link, redirect } from 'react-router-dom'

// Routes
import Home from './home';
import Login from './auth/login';
import Signup from './auth/signup';

// icons
import { CiSettings } from "react-icons/ci";

//Shadcn
import { Button } from './components/ui/button';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { ProfileToggle } from "@/components/ui/profile-toggle"
import { ProfileDialog } from "@/components/pages/profile-dialog"


function App() {
	const [token, setToken] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const apiUrl = 'https://api.madanilab.site';
	// const apiUrl = 'http://192.168.1.111:3000';
	const config = {
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
			'CF-Access-Client-Id': '06b0630f66b18f473a617819261e2e6a.access',
			'CF-Access-Client-Secret': '2554796ee90aee81b35787f4d427b86bd1d0cece38c6d9d8bee9336b88b52eb6'
		},
	};
	
	useEffect(() => {
		const getBearerToken = async () => {
			const storedToken = localStorage.getItem('FinanceMadaniLabBearerToken');
			const userId = localStorage.getItem('FinanceMadaniLabUserId');
			
			if (storedToken) {
				setToken(storedToken);

				try {
					const response = await axios.get(apiUrl+'/auth/authenticated/'+userId, {
						headers: {
							Authorization: `Bearer ${storedToken}`,
							'Content-Type': 'application/json',
							'CF-Access-Client-Id': '06b0630f66b18f473a617819261e2e6a.access',
							'CF-Access-Client-Secret': '2554796ee90aee81b35787f4d427b86bd1d0cece38c6d9d8bee9336b88b52eb6'
						},
					});
					console.log(response)
					if (response.status === 200) {
						setIsAuthenticated(true);
					} else {
						setIsAuthenticated(false);
					}
				} catch (error) {
					setIsAuthenticated(false);
					console.log(error)
				}
				// console.log('isAuthenticated: true',token); // it should change to isauthenticated to be secure

				// window.location.reload();
				return redirect("/home");
			} else {
				setIsAuthenticated(false);
				console.log("there is no stored token");
				return redirect("/login");
			}
		}
		getBearerToken();

	}, [token]);

	return (
		<>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="header">
				<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0" >MadaniLab Finance</h2>
				{!isAuthenticated ? <ModeToggle /> : <ProfileDialog />}
			</div>
			
			<Routes>
				<Route path='/' element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
				<Route path='/home' element={isAuthenticated ? <Home /> : <Navigate to="/login" />} >

				</Route> 
				<Route path='/login' element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
				<Route path='/signup' element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} />
			</Routes>
    	</ThemeProvider>
		</>
	)
}

export default App
