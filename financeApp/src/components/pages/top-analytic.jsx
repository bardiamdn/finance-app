import React, {PureComponent, useContext, useState, useReducer, useEffect, useLayoutEffect} from "react";
import axios from "axios";

// context
import { DataContext } from "@/home";

//components
import { Skeleton } from "@/components/ui/skeleton"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Brush,
    AreaChart,
    Area,
    ResponsiveContainer,
    BarChart, 
    Bar, 
    Cell 
} from 'recharts';
import { PieChart, Pie, Sector } from 'recharts';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"  
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// icons
import { LuPlusSquare } from "react-icons/lu"
import { TbSquareRoundedPlusFilled } from "react-icons/tb"
import { FiPlus, FiEdit3, FiEdit2 } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";
import { GoTrash } from "react-icons/go";

// colors
import { colors } from "@/components/ui/colors"
const green = "#25ff1dbd"
const red = "#ff1d1dbd"


export function TotalBalance() {
	// context variable
	const { update, setUpdate, userData, setUserData, token, userId, balanceData, getBalances, getProfileData } = useContext(DataContext)
	// states
	// loading userData
	const [loading, setLoading] = useState(true);

	// effect for loading the useData
	useEffect(() => {
		setLoading(true);
		if(userData && balanceData) {
			setLoading(false);
		}
	}, [userData, balanceData, update]);

	if (loading) {
        return <Skeleton className="w-[310px] h-[165px]"></Skeleton>;
    }
    return (
        <div>
			<Card  className="w-[310px] h-[165px] flex flex-col align-stretch justify-stretch">
                <CardHeader className="flex align-start justify-start">
                    <CardTitle className="flex flex-row align-center justify-between">Total Balance</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center">
                {
                    balanceData.totalBalance > 0 ?
                        <p style={{ fontSize: "40px", color: "#25ff1dbd" }}>{balanceData.totalBalance.toLocaleString()}</p>
                    :
                        <p style={{ fontSize: "40px", color: "#ff1d1dbd" }}>{balanceData.totalBalance.toLocaleString()}</p>
                }
                </CardContent>
            </Card>
        </div>
    )
}

export function IncomeExpenseBalance() {
	// context variable
	const { update, setUpdate, userData, setUserData, token, userId, balanceData, getBalances, getProfileData } = useContext(DataContext)
	const [loading, setLoading] = useState(true);

	// effect for loading the useData
	useEffect(() => {
		setLoading(true);
		if(userData && balanceData) {
            setLoading(false);
		}
	}, [userData, balanceData, update]);

	if (loading) {
        return <Skeleton className="w-[380px] h-[165px]"></Skeleton>;
    }
    return (
        <div>
			<Card  className="w-[380px] h-[165px] flex flex-col align-stretch justify-stretch">
                <CardHeader className="flex align-start justify-start">
                    <CardTitle className="flex flex-row align-center justify-between">Income, Expense Balance
                    </CardTitle>
                    {/* <CardDescription className="flex align-start justify-start">Change the Category's Type, Color and Name</CardDescription> */}
                </CardHeader>
                <CardContent  width="240px" height="150px" className="flex flex-row justify-center items-center">
                    <div className="flex flex-col justify-center items-center mr-10">
                        <p style={{ color: "#25ff1dbd" }} className="mb-5">{balanceData.totalIncome.toLocaleString()}</p>
                        <p style={{ color: "#ff1d1dbd" }}>{balanceData.totalExpense.toLocaleString()}</p>
                    </div>
                    <div className="w-[150px] h-[90px]"
                    //  style={{ border: "1px solid #ffffff" }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart width="50px" height="30px" data={[
                                {"name": "balance", "expense":balanceData.totalExpense, "income":balanceData.totalIncome}
                            ]}>
                                <Bar dataKey="expense" fill="#ff1d1dbd" />
                                <Bar dataKey="income" fill="#25ff1dbd" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export function AccountsAnalyticPie() {
	// context variable
	const { apiUrl, update, setUpdate, config, userData, setUserData, token, userId, balanceData, getBalances, getProfileData } = useContext(DataContext)

    // const [ accountAnalyticData, setAccountAnalyticData ] = useState(null);
    const [ accountData, setAccountData ] = useState(null);
	const [loading, setLoading] = useState(true);
    const [selectedAccount, setSelectedAccount] = useState(null);
    
	// variables
	// const apiUrl = 'http://localhost:3000';
	// const apiUrl = 'http://192.168.1.111:3000';
	// const config = {
	// 	headers: {
	// 		Authorization: token,
	// 		'Content-Type': 'application/json'
	// 	},
	// };


	useEffect(() => {
        setLoading(true);
        const getAccountAnalytic = async () => {
            try {
                const response = await axios.get(apiUrl + '/api/balance/timeframe-account-balance/' + userId, config);
                console.log(response)
                if ((response.status === 200) && (userData.accounts.length > 0) && (userData.categories.length > 0)) {
                    const accountAnalyticData = response.data.accountsBalance;
                    
                    const accountIdToInfoMap = userData.accounts.reduce((map, account) => {
                        map[account._id] = { color: account.accountColor, title: account.accountTitle };
                        return map;
                    }, {});

                    const coloredAccountData = accountAnalyticData.map(account => {
                        const accountColorTitle = accountIdToInfoMap[account.accountId];
                        return { ...account, ...accountColorTitle };
                    });
                    
                    // console.log("coloredAccountData", coloredAccountData)
                    setAccountData(coloredAccountData);
                    setLoading(false);
                } else if (response.status === 204) {
                    setLoading(true)
                }

            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        getAccountAnalytic();
    }, [userData, update]);

	

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (loading) {
        return <Skeleton className="w-[641.3px] h-[340px]"></Skeleton>;
    }
    return (
        <div>
            <Card  className="w-[641.3px] h-[340px]">
                {/* In the version 1.01 I will make these changes */}
                {/* <div className=" flex flex-row justify-between items-center"> */}
                    <CardHeader className="w-[50%] flex items-start" >
                        <CardTitle >
                            Account Analytics
                        </CardTitle>
                    </CardHeader>
                    {/* <Dialog >
                        <DialogTrigger 
                        // style={{ border: "1px solid #fff" }}
                         className="mt-[20px] mr-[25px]">
                            <Button variant="ghost">
                                <LuPlus className="w-4 h-4"></LuPlus>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Add New Account</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog> */}
				{/* </div> */}
                <CardContent style={{ width: '100%', height: '300px'}} className="flex flex-row p-0">
                    <div style={{ width: '50%', height: '256px'}} className="flex flex-col mb-[25px] ml-[25px] p-[15px]"  >
                        <ScrollArea width="100%" height="100%">
                                {accountData ?
                                    accountData.map(account => (
                                        
                                        <div key={account.accountId} className="flex flex-row justify-start align-center mb-5" onClick={() => {setSelectedAccount(account); console.log(account)}}>
                                            <div className={`w-6 h-6 rounded-md colorDiv`} style={{ backgroundColor: `${account.color}` }}></div>
                                            <p className="w-[150px] ml-2 flex justify-start overflow-hidden whitespace-nowrap text-overflow-ellipsis">{account.title}</p>
                                            {account.balance > 0 ?
                                                <p className="w-[40px] ml-4" style={{ color: "#25ff1dbd" }} >{account.balance}</p>
                                            :
                                                <p className="w-[40px] ml-4" style={{ color: "#ff1d1dbd" }} >{account.balance}</p>
                                            }
                                        </div>
                                        )
                                    )
                                : <div>Loading...</div>
                                }
                        </ScrollArea>
                    </div>
                    <div  className="flex justify-start align-start items-start" style={{ width: '50%', height: '256px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart  width="256px" height="256px">
                            <Pie
                                data={accountData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius="200px"
                                fill="#8884d8"
                                dataKey="balance"
                            >
                                {accountData ?
                                    accountData.map((account, index) => (
                                    <Cell key={`cell-${index}`} fill={account.color} />
                                ))
                                :
                                <div/>
                                }
                            </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Account Edit and Add Update version 1.0.1
/*
<div>
            <Card  className="w-[641.3px] h-[340px]">
                <div className=" flex flex-row justify-between items-center">
                    <CardHeader className="w-[50%] flex items-start" >
                        <CardTitle >
                            Category Analytics
                        </CardTitle>
                    </CardHeader>
                    <Dialog >
                        <DialogTrigger 
                        // style={{ border: "1px solid #fff" }}
                         className="mt-[20px] mr-[25px]">
                            <Button variant="ghost">
                                <LuPlus className="w-4 h-4"></LuPlus>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Add New Account</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
				</div>
                <CardContent style={{ width: '100%', height: '300px'}} className="flex flex-row p-0">
                    <div style={{ width: '50%', height: '256px' }} className="flex flex-col mt-[25px] mb-[25px]"  >
                        <ScrollArea width="100%" height="100%" className="mb-10px" >
                                {accountData ?
                                    accountData.map(account => (
                                        <Dialog>
                                            <DialogTrigger className="flex-col">
                                        
                                                <div key={account.accountId} className="flex flex-row justify-start align-center mb-5" onClick={() => {setSelectedAccount(account); console.log(account)}}>
                                                    <div className={`w-6 h-6 rounded-md colorDiv`} style={{ backgroundColor: `${account.color}` }}></div>
                                                    <p className="w-[150px] ml-2 flex justify-start overflow-hidden whitespace-nowrap text-overflow-ellipsis">{account.title}</p>
                                                    {account.balance > 0 ?
                                                        <p className="w-[40px] ml-4" style={{ color: "#25ff1dbd" }} >{account.balance}</p>
                                                    :
                                                        <p className="w-[40px] ml-4" style={{ color: "#ff1d1dbd" }} >{account.balance}</p>
                                                    }
                                                </div>
                                            </DialogTrigger>
                                            {selectedAccount ?
                                                <DialogContent>
                                                    <DialogHeader>
                                                    <DialogTitle>{selectedAccount.title}</DialogTitle>
                                                    <DialogDescription>
                                                        Make Changes and Save
                                                    </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex flex-col">
                                                        <div  className="flex flex-row">
                                                            
                                                            <Input defaultValue={selectedAccount.title}></Input>
                                                        </div>
                                                        <div className="flex flex-row justify-between">
                                                            <Button variant="destructive">
                                                                Delete Account
                                                            </Button>
                                                            <Button>
                                                                Save
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            :
                                                <></>
                                            }
                                        </Dialog>
                                        )
                                    )
                                : <div>Loading...</div>
                                }
                        </ScrollArea>
                    </div>
                    <div  className="flex justify-start align-start items-start" style={{ width: '50%', height: '256px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart  width="256px" height="256px">
                            <Pie
                                data={accountData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius="200px"
                                fill="#8884d8"
                                dataKey="balance"
                            >
                                {accountData.map((account, index) => (
                                    <Cell key={`cell-${index}`} fill={account.color} />
                                ))}
                            </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
*/

export function Last90Days() {
    // context variable
	const { apiUrl, update, setUpdate, config, userData, setUserData, token, userId, balanceData, getBalances, getProfileData } = useContext(DataContext)

    // const [ accountAnalyticData, setAccountAnalyticData ] = useState(null);
    const [ ninetyDaysData, setNinetyDaysData ] = useState(null);
	const [loading, setLoading] = useState(true);
    
    
	// variables
	// const apiUrl = 'http://localhost:3000';
	// const apiUrl = 'http://192.168.1.111:3000';
	// const config = {
	// 	headers: {
	// 		Authorization: token,
	// 		'Content-Type': 'application/json'
	// 	},
	// };


    useEffect(() => {
        setLoading(true);

        const getData = async () => {
            try {
                const response = await axios.get(apiUrl+'/api/balance/last90days-expense-income-balance/'+userId, config);
                if (response.status === 200) {
                    const data = response.data.data.map(item => {
                        return {
                            ...item,
                            date: item.date.split('T')[0].split('-')[2]
                        };
                    });
                    
                    setNinetyDaysData(data);

                    // console.log("90 Days Data:", response.data.data)
                    setLoading(false);
                } else if (response.status === 204) {
                    setLoading(true)
                }
            }catch (error) {
                console.log(error)
                setLoading(false);
            }
        }
        getData();

    }, [userData, userId, update])
    
    if (loading) {
        return <Skeleton className="w-[700px] h-[515px]"></Skeleton>;
    }
    return (
        <div>
			<Card  className="w-[700px] h-[515px] flex flex-col align-stretch justify-stretch">
                <CardHeader className="flex align-start justify-start">
                    <CardTitle className="flex flex-row align-center justify-between">Last 30 Days
                    </CardTitle>
                    {/* <CardDescription className="flex align-start justify-start">Change the Category's Type, Color and Name</CardDescription> */}
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center">

                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                            width={500}
                            height={200}
                            data={ninetyDaysData}
                            syncId="anyId"
                            margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                            }}
                        >
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar type="monotone" dataKey="expense" stroke={red} fill={red} />
                            <Bar type="monotone" dataKey="income" stroke={green} fill={green} />
                            <Brush startIndex={60} dataKey="date" fill="#c9c9c9ce" stroke="c9c9c9b2"/>
                        </BarChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                            width={500}
                            height={200}
                            data={ninetyDaysData}
                            syncId="anyId"
                            margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                            }}
                        >
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="balance" stroke="#838383" fill="#9494949d" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
