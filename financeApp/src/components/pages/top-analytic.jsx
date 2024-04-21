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
    DialogClose
} from "@/components/ui/dialog"  
import { Badge } from "@/components/ui/badge"
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
import { colors, myColors } from "@/components/ui/colors"
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

    const [ accountData, setAccountData ] = useState(null);
	const [loading, setLoading] = useState(true);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [newAccountData, setNewAccountData] = useState({
		accountTitle: "",
		accountColor: colors[0].value,
    });


	useEffect(() => {
        setLoading(true);
        const getAccountAnalytic = async () => {
            try {
                const response = await axios.get(apiUrl + '/api/balance/timeframe-account-balance/' + userId, config);
                if ((response.status === 200) && (userData.accounts.length > 0)) {
                    const accountsBalance = response.data.accountsBalance.reduce((map, account) => {
                        map[account.accountId] = { balance: account.balance};
                        return map;
                    }, {});

                    const coloredAccountData = userData.accounts.map(account => {
                        const accountBalance = accountsBalance[account._id];
                        if (accountBalance) {
                            return { ...account, ...accountBalance}
                        } else {
                            return { ...account, balance: 0 }
                        }
                    })
                    
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

	async function addNewAccount() {
        try {
            if(token && userId && newAccountData.accountTitle.length > 0) {
                await axios.put(apiUrl+'/api/profile/add-account/'+userId, newAccountData, config)
                .then(response => {
                    
                    // window.location.reload();
                    // console.log(response)
                    setUserData(response.data.data);
                })
                setNewAccountData({
                    accountTitle: "",
                    accountColor: colors[0].value,
                });
            }
        } catch(error) {
            console.error('Error posting data:', error);
        }
        // setAddClicked(prevState => !prevState)
    }

    async function updateAccount() {
        try {
            if(token && userId && selectedAccount) {
                const index = userData.accounts.findIndex(account => account._id === selectedAccount._id);
                if ( index !== -1 ) {
                    userData.accounts[index] = {
                        ...userData.accounts[index],
                        accountTitle: selectedAccount.accountTitle,
                        accountColor: selectedAccount.accountColor,
                    }
                } else {
                    console.log("Nothing was updated, because account with id: ", accountId, "was not found.");
                    return userData;
                }

                await axios.put(apiUrl+'/api/profile/update-account/'+userId, userData, config)
                .then(response => {
                    setUserData(response.data.data)
                })
            }
        } catch(error) {
            console.error('Error posting data:', error);
        }
    }

    async function deleteAccount(id) {
        try {
            if (token && userId) {
                await axios.delete(`${apiUrl}/api/profile/remove-account/${userId}/?accountId=${id}`, config)
                .then(response => {
                    setUserData(response.data.data)
                })
            }
        } catch(error) {
            console.error('Error posting data:', error);
        }
    }

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
                <div className=" flex flex-row justify-between items-center">
                    <CardHeader className="w-[50%] flex items-start" >
                        <CardTitle >
                            Accounts
                        </CardTitle>
                    </CardHeader>
                    <Dialog  className="w-[50%] flex items-end">
						<DialogTrigger
                        >
							<Badge className="w-[50px] h-[35px] mt-[15px] mr-[30px] justify-center align-center" variant="ghost">
								<LuPlus className="h-4 w-4"></LuPlus>
							</Badge>
						</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Add New Account</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-row justify-center items-center mt-[25px]">
                                <DropdownMenu className="colorDiv">
                                    <DropdownMenuTrigger>
                                        <div className={`w-8 h-7 rounded-md mr-2 colorDiv`} style={{backgroundColor: newAccountData.accountColor}}></div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                        <div className="flex justify-between items-center">
                                            Current Color
                                            <div className={`w-8 h-7 rounded-md colorDiv`} style={{backgroundColor: newAccountData.accountColor}}></div>
                                        </div>
                                        </DropdownMenuLabel>
                                        <ScrollArea className="h-72 w-[200px] rounded-md border">
                                            <div className="grid grid-cols-4 gap-[1px]">
                                                {myColors.length > 0 ?
                                                    myColors.map((color, index) => (
                                                    <DropdownMenuItem key={color.value} onClick={() => setNewAccountData(prevData => ({ ...prevData, accountColor: color.value }))}>
                                                        <div className="flex justify-center items-center">
                                                            <div className="w-8 h-7 rounded-md colorDiv" style={{backgroundColor: `${color.value}`}}></div>
                                                        </div>
                                                        {index % 4 === 3 && <div className="w-full"></div>} {/* Add a new row after every four items */}
                                                    </DropdownMenuItem>
                                                ))
                                                :
                                                <div/>
                                                }
                                            </div>
                                        </ScrollArea>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                    
                                <Input className="w-50" defaultValue={newAccountData.accountTitle} placeholder="Category Name" onChange={(e) => setNewAccountData(prevData => ({...prevData, accountTitle: e.target.value}))}>
                                    
                                </Input>
                            </div>
                            
                            <DialogClose className="flex justify-end">
                                <Badge className="w-[70px] h-[37px] flex justify-center items-center" onClick={() => addNewAccount()}>
                                    <p style={{ fontSize: 'small', margin: '0' }}>Save</p>
                                </Badge>
                            </DialogClose>
                        </DialogContent>
                    </Dialog>
				</div>
                <CardContent style={{ width: '100%', height: '300px'}} className="flex flex-row p-0">
                    <div style={{ width: '50%', height: '256px' }} className="flex flex-col mt-[25px] mb-[25px]"  >
                        <ScrollArea width="100%" height="100%" className="mb-10px" >
                                {accountData ?
                                    accountData.map(account => (
                                        <Dialog key={account._id}>
                                            <DialogTrigger onClick={() => {setSelectedAccount(account)}}
                                            // style={{ border: "1px solid #ffff" }}
                                            >
                                        
                                                <div key={account._id} className="flex flex-row justify-start align-center my-[10px]"
                                                // style={{ border: "1px solid #ffff" }}
                                                >
                                                <div className='w-6 h-6 rounded-md colorDiv' style={{ backgroundColor: `${account.accountColor}` }}></div>
                                                    <p className="w-[150px] ml-2 flex justify-start overflow-hidden whitespace-nowrap text-overflow-ellipsis">{account.accountTitle}</p>
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
                                                        <DialogTitle>{selectedAccount.accountTitle}</DialogTitle>
                                                        <DialogDescription>
                                                            Make Changes and Save
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex flex-col">
                                                        <div className="flex flex-row justify-center items-center mt-[25px]">
                                                            <DropdownMenu className="colorDiv">
                                                                <DropdownMenuTrigger>
                                                                    <div className={`w-8 h-7 rounded-md mr-2 colorDiv`} style={{backgroundColor: selectedAccount.accountColor}}></div>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    <DropdownMenuLabel>
                                                                    <div className="flex justify-between items-center">
                                                                        Current Color
                                                                        <div className={`w-8 h-7 rounded-md colorDiv`} style={{backgroundColor: selectedAccount.accountColor}}></div>
                                                                    </div>
                                                                    </DropdownMenuLabel>
                                                                    <ScrollArea className="h-72 w-[200px] rounded-md border">
                                                                        <div className="grid grid-cols-4 gap-[1px]">
                                                                            {myColors.length > 0 ?
                                                                                myColors.map((color, index) => (
                                                                                <DropdownMenuItem key={color.value} onClick={() => setSelectedAccount(prevData => ({ ...prevData, accountColor: color.value }))}>
                                                                                    <div className="flex justify-center items-center">
                                                                                        <div className="w-8 h-7 rounded-md colorDiv" style={{backgroundColor: `${color.value}`}}></div>
                                                                                    </div>
                                                                                    {index % 4 === 3 && <div className="w-full"></div>} {/* Add a new row after every four items */}
                                                                                </DropdownMenuItem>
                                                                            ))
                                                                            :
                                                                            <div/>
                                                                            }
                                                                        </div>
                                                                    </ScrollArea>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                            <Input className="w-50" defaultValue={selectedAccount.accountTitle} placeholder="Account Name" onChange={(e) => setSelectedAccount(prevData => ({...prevData, accountTitle: e.target.value}))}></Input>
                                                        </div>
                                                            <div className="flex justify-between">
                                                                <Dialog>
                                                                    <DialogTrigger>
                                                                        <Badge className="w-[70px] h-[37px] flex justify-center items-center" variant="outline">
                                                                            <p style={{ fontSize: 'small', margin: '0' }}>Delete</p>
                                                                        </Badge>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                        <DialogTitle>Delete the {selectedAccount.accountTitle} account?</DialogTitle>
                                                                        <DialogDescription>
                                                                            This action cannot be undone and it will permanently delete your {selectedAccount.accountTitle} Account. Are you sure?
                                                                        </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="flex flex-row justify-end">
                                                                            <DialogClose>
                                                                                    <Badge className="w-[100px] h-[37px] flex justify-center items-center" variant="outline">
                                                                                        <p style={{ fontSize: 'small', margin: '0' }}>Cancel</p>
                                                                                    </Badge>
                                                                            </DialogClose>
                                                                            <DialogClose>
                                                                                    <Badge className="ml-[10px] w-[100px] h-[37px] flex justify-center items-center" variant="destructive" onClick={() => deleteAccount(selectedAccount._id)}>
                                                                                        <p style={{ fontSize: 'small', margin: '0' }}>Delete</p>
                                                                                    </Badge>
                                                                            </DialogClose>
                                                                        </div>
                                                                    </DialogContent>
                                                                </Dialog>
                                                                <DialogClose>
                                                                    <Badge className="w-[70px] h-[37px] flex justify-center items-center" onClick={() => updateAccount()}>
                                                                        <p style={{ fontSize: 'small', margin: '0' }}>Save</p>
                                                                    </Badge>
                                                                </DialogClose>
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
                                    <Cell key={account._id} fill={account.accountColor} />
                                ))}
                            </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

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
