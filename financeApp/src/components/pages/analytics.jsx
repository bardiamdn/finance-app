import React, {PureComponent, useContext, useState, useReducer, useEffect} from "react";
import axios from "axios";

// context
import { DataContext } from "@/home";

//components
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ResponsiveSankey } from '@nivo/sankey'
import { 
	Sankey,
	PieChart, 
	Pie, 
	Sector, 
	BarChart, 
	Bar, 
	Cell, 
	XAxis, 
	YAxis, 
	CartesianGrid, 
	Tooltip, 
	Legend, 
	Rectangle, 
	Layer,
	ResponsiveContainer } from 'recharts';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
	DialogFooter,
} from "@/components/ui/dialog"
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
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
// icons
import { BsCalendar4Week } from "react-icons/bs";
import { LuPlusSquare } from "react-icons/lu"
import { TbSquareRoundedPlusFilled } from "react-icons/tb"
import { FiPlus, FiEdit3, FiEdit2 } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";
import { GoTrash } from "react-icons/go";

// colors
import { colors } from "@/components/ui/colors"
import { FaCommentsDollar } from "react-icons/fa";

const green = "#25ff1dbd"
const red = "#ff1d1dbd"
const greenHsl = "hsla(118, 100%, 56%, 0.741)"
const redHsl = "hsla(0, 100%, 56%, 0.741)"


export function CategoryAnalytic() {
	// context variable
	const { apiUrl, update, config, userData, setUserData, token, userId, balanceData, getBalances, getProfileData } = useContext(DataContext)
	
	let tempData = {}
	// states
	// loading userData
	const [ loading, setLoading ] = useState(true);
	const [ pieDataIncome, setPieDataIncome ] = useState(null);
	const [ pieDataExpense, setPieDataExpense ] = useState(null);
	const [ barData, setBarData ] = useState(null);
	const [ period , setPeriod ] = useState("this_month");

	const [ temp, setTemp ] = useState()
	// const [ gap, setGap ] = useState("")
	
	// switch (period) {
	// 	case "this_week":
	// 	case "this_month":
	// 		setGap("Day");
	// 		break;
	// 	case "last_3_months":
	// 		setGap("Week");
	// 		break;
	// 	case "last_6_months":
	// 	case "this_year":
	// 	case "last_3_years":
	// 	case "max":
	// 		setGap("Month");
	// 		break;
	// 	default:
	// 		setGap("Week");
	// 		break;
	// }

	// variables
	// const apiUrl = 'http://localhost:3000';
	// const apiUrl = 'http://192.168.1.111:3000';
	// const config = {
	// 	headers: {
	// 		Authorization: token,
	// 		'Content-Type': 'application/json'
	// 	},
	// };

	async function getData(dataPeriod) {
		try {
			const response = await axios.get(`${apiUrl}/api/balance/category-analytic/${userId}?period=${dataPeriod}`, config);
			// console.log(`${apiUrl}/api/balance/category-analytic/${userId}?period=${dataPeriod}`, response.data);
			if ( (response.status === 200) && (userData.categories.length > 0) && (userData.accounts.length > 0) && (response.data.pieData || response.data.barData)) {
				let dataPieIncome = response.data.pieData.income;
				let dataPieExpense = response.data.pieData.expense;
				let dataBar = response.data.barData;
				// console.log("From Category Analytic", dataBar)
				userData.categories.map(category => {
					tempData[category._id] = {color: category.categoryColor, title: category.categoryTitle}
				});
				setTemp(tempData)
				// console.log("Temp from Category Analytic", tempData)
				// pie
				// (dataPieIncome && dataPieIncome.length > 0 ?
				dataPieIncome = dataPieIncome.map(category => (
					{...tempData[category.categoryId], ...category }
				))
				// :
				// 	dataPieIncome = []
				// );
				// (dataPieExpense && dataPieExpense.length > 0 ?
				dataPieExpense = dataPieExpense.map(category => (
					{ ...tempData[category.categoryId], ...category }
				))
				// :
				// 	dataPieExpense = []
				// );
				// for ( id of Object.keys(temp) ) {
				// 	if (dataBar.forEach())
				// }
	
				setBarData(dataBar)
				setPieDataIncome(dataPieExpense)
				setPieDataExpense(dataPieIncome)
				// dataPieIncome = []
				// dataPieExpense = []

				setLoading(false)
			} else if (response.status === 204) {
				setLoading(true)
			}
		} catch (error) {
			console.log(error);
			setLoading(false)
		}
	}	

	// effect for loading the useData
	useEffect(() => {
		setLoading(true);
		getData(period);
		if(userData && balanceData) {
			setLoading(false);
		}
	}, [userData, update]);

	const periodChange = (event) => {
		setPeriod(event.target.value);
		console.log(period)
		getData();
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
        return <Skeleton className="w-[951.3px] h-[490px]"></Skeleton>;
    }
    return (
      <div>
			<Card  className="w-[951.3px] h-[490px] flex flex-col align-stretch justify-stretch">
				<div className=" flex flex-row justify-between items-center">
					<CardHeader className="w-[50%] flex items-start" >
						<CardTitle >
							Category Analytics
						</CardTitle>
							<p  className="text-sm text-muted-foreground">Bars as gaps</p>
					</CardHeader>
					<Select onValueChange={(value) => {setPeriod(value); getData(value)}} defaultValue={period}>
						<SelectTrigger className="w-[130px] mr-[30px]">
							<SelectValue placeholder="Choose Period"/>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="this_week">This Week</SelectItem>
							<SelectItem value="this_month">This Month</SelectItem>
							<SelectItem value="last_3_months">Last 3 Months</SelectItem>
							<SelectItem value="last_6_months">Last 6 Months</SelectItem>
							<SelectItem value="this_year">This Year</SelectItem>
							{/* <SelectItem value="last_3_years">Last 3 Years</SelectItem> */}
							{/* <SelectItem value="max">Max</SelectItem> */}
							<SelectItem disabled={true} value="max">Custom</SelectItem>
							{/* <SelectItem onClick={() => setPeriod(value)} value="custom">Custom</SelectItem> */}
						</SelectContent>
					</Select>
				</div>
                <CardContent className="flex flex-row justify-center items-center w-[100%] h-[100%]">
				<div className="flex flex-col w-[75%] h-[100%]">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
						width={500}
						height={300}
						data={barData}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5,
						}}
						>
						{/* <CartesianGrid strokeDasharray="3 3" /> */}
						<XAxis dataKey="gap" />
						<YAxis />
						<Tooltip 
						labelFormatter={(keys, values, third) => 
							{
								values.forEach(value => {
									value.name = temp[value.dataKey].title
								});
								// console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", keys)
								// console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV", values)
								return { keys: keys, values: values }
							}
						}
						/>
						{/* <Legend /> */}
						{userData.categories.length > 0 ?
							userData.categories.map((category, index) => (
								(category.categoryType === "expense" ?
									<Bar key={index} dataKey={category._id} stackId="expense" fill={category.categoryColor} />
								: category.categoryType === "income" ?
									<Bar key={index} dataKey={category._id} stackId="income" fill={category.categoryColor} />
								:
									<></>
								)
							))
						:
						<div/>
						}
						</BarChart>
					</ResponsiveContainer>
				</div>
				<div className="flex flex-col w-[25%] h-[100%]">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart width={400} height={400}>
							<Pie
								data={pieDataExpense}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={renderCustomizedLabel}
								outerRadius={80}
								fill="#8884d8"
								dataKey="amount"
							>
								{pieDataExpense ?
									pieDataExpense.map((category, index) => (
									<Cell key={category.categoryId} fill={category.color} />
									))
								:
								<Skeleton></Skeleton>
								}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart width={400} height={400}>
							<Pie
								data={pieDataIncome}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={renderCustomizedLabel}
								outerRadius={80}
								fill="#8884d8"
								dataKey="amount"
							>
								{pieDataIncome ?
									pieDataIncome.map((category, index) => (
									<Cell key={category.categoryId} fill={category.color} />
									))
								:
								<Skeleton></Skeleton>
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

export function History() {
	// context variable
	const { apiUrl, update, setUpdate, config, userData, setUserData, token, userId, balanceData, getBalances, getProfileData  } = useContext(DataContext)

	const [historyData, setHistoryData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [transactionData, setTransactionData] = useState(null);
	const [totalPages, setTotalPages] = useState(null);
	const [currentPage, setCurrentPage] = useState(null);

	// variables
	// const apiUrl = 'http://localhost:3000';
	// const apiUrl = 'http://192.168.1.111:3000';
	// const config = {
	// 	headers: {
	// 		Authorization: token,
	// 		'Content-Type': 'application/json'
	// 	},
	// };

	async function getHistoryData (URL) {
		try {
			const response = await axios.get(URL, config);
			if ( (response.status === 200) && (userData.categories.length > 0) && (userData.accounts.length > 0) && response.data.data ) {
				let transactionsData = response.data.data;
				
				const accountIdToInfoMap = userData.accounts.reduce((map, account) => {
					map[account._id] = { accountColor: account.accountColor, accountTitle: account.accountTitle};
					return map;
				}, {});
				const categoryIdToInfoMap = userData.categories.reduce((map, category) => {
					map[category._id] = { categoryColor: category.categoryColor, categoryTitle: category.categoryTitle };
					return map;
				}, {});
				
				const updatedTransactionData = transactionsData.map(transaction => {
					const accountColorTitle = accountIdToInfoMap[transaction.accountId];
					const toAccountColorTitle = (transaction.toAccountId ? accountIdToInfoMap[transaction.toAccountId] : "");
					const categoryColorTitle = categoryIdToInfoMap[transaction.categoryId];
					return { ...transaction, ...accountColorTitle , ...categoryColorTitle, toAccountTitle: toAccountColorTitle.accountTitle };
				});
				updatedTransactionData.sort((a, b) => new Date(b.date) - new Date(a.date));
				
				setCurrentPage(response.data.currentPage)
				setTotalPages(response.data.totalPages)
				setHistoryData(updatedTransactionData);
				setLoading(false);
			} else if (response.status === 204) {
				setLoading(true)
			}
		} catch (error) {
			console.log(error)
			if(userData) {
				setLoading(false);
			}
		}
	}

	// effect for loading the useData
	useEffect(() => {
		setLoading(true);
		
		getHistoryData(apiUrl+'/api/transaction/read/'+userId);
	}, [userData, update]);

	function submitChanges() {
		const { accountColor, accountTitle, categoryColor, categoryTitle, toAccountTitle, ...rest } = transactionData;
		const updatedData = { ...rest };

		console.log("TransactionData Before Submittion", updatedData)
		
		try{
			if (userId && token && updatedData) {
				axios.put(apiUrl+"/api/transaction/update/"+userId, updatedData, config)
				.then(response => {
					console.log(response)
					// setUserData(response)
				})
				// setTransactionData(null);
				// getHistoryData();
				setUpdate(prevState => (!prevState))
			} else {
				console.log("Missing Data")
			}
		} catch (error) {
			console.error('Error adding category:', error);
		}
		console.log("TransactionData After Submittion", transactionData)
	}
	async function deleteTransaction() {
		try {
			// console.log("transactionData", transactionData)
			// console.log("transactionDataID", transactionData._id)
			const result = await axios.delete(apiUrl+'/api/transaction/delete/'+userId+'/'+transactionData._id, config);
			console.log(result)
			setUpdate(prevState => (!prevState))
			// getHistoryData();
		} catch (error) {
			console.log(error)
		}
	}

	const generatePaginationLinks = (totalPages) => {
		const paginationLinks = [];
    
		// Include the current page
		paginationLinks.push(
			<PaginationItem key={currentPage}>
				<PaginationLink href="#" onClick={(e) => {handlePaginationClick(e, currentPage); e.preventDefault()}}>
					{currentPage}
				</PaginationLink>
			</PaginationItem>
		);
	
		// Include the previous page if currentPage is not the first page
		if (currentPage > 1) {
			paginationLinks.unshift(
				<PaginationItem key={currentPage - 1}>
					<PaginationLink href="#" onClick={(e) => {handlePaginationClick(e, currentPage - 1); e.preventDefault()}}>
						{currentPage - 1}
					</PaginationLink>
				</PaginationItem>
			);
		}
	
		// Include the next page if currentPage is not the last page
		if (currentPage < totalPages) {
			paginationLinks.push(
				<PaginationItem key={currentPage + 1}>
					<PaginationLink href="#" onClick={(e) => {handlePaginationClick(e, currentPage + 1); e.preventDefault()}}>
						{currentPage + 1}
					</PaginationLink>
				</PaginationItem>
			);
		}
	
		return paginationLinks;
	};

	function handlePaginationClick(e, i) {
		getHistoryData(`${apiUrl}/api/transaction/read/${userId}?page=${i}`)
	}

	if (loading && !historyData) {
        return <Skeleton className="w-[390px] h-[1150px]"></Skeleton>
    }
    return (
        <div>
			<Card  className="w-[390px] h-[1150px] flex flex-col align-stretch justify-stretch">
                <CardHeader className="flex align-start justify-start">
                    <CardTitle className="flex flex-row align-center justify-between mb-[10px]">History
                    </CardTitle>
                    {/* <CardDescription className="flex align-start justify-start">Select and Make Changes</CardDescription> */}
                </CardHeader>
                <CardContent  
				// style={{ border: "1px solid #ffff" }} 
				className="flex flex-col h-[1100px] w-[390px]">
					<ScrollArea 
					// style={{ border: "1px solid #ffff" }} 
					className="flex justify-center align-start w-[340px] h-[1000px] ml-0">
						{ historyData ?
							historyData.map((item, index) => (
								<Dialog key={index}>
									<DialogTrigger onClick={() => setTransactionData(item)}>
										<div className="flex flex-row items-center justify-between ">
											<div className="text-sm text-muted-foreground">{index+1}</div>
											<div key={item._id} className="flex flex-col mr-[10px]">
												<div className="flex flex-row items-center justify-between text-sm text-muted-foreground">
													{item.date.split('T')[0]}
													<div className="flex flex-row items-end justify-end text-sm text-muted-foreground">{item.accountTitle}</div>
												</div>
												{item.type === "expense" ? 
												<div className="flex flex-row  items-center justify-between m-[5px] ml-[20px]">
													<div className="flex flex-row items-start justify-start" style={{ fontSize: "20px", color: red}}>
														{item.amount}
													</div>
													<div className="flex flex-row items-center justify-center mr-[20px]">{item.categoryTitle}</div>
												</div>
												: item.type === "income" ?
												<div className="flex flex-row  items-center justify-between m-[5px] ml-[20px]">
													<div className="flex flex-row items-start justify-start" style={{ fontSize: "20px", color: green}}>
														{item.amount}
													</div>
													<div className="flex flex-row items-center justify-center mr-[20px]">{item.categoryTitle}</div>
												</div>
												:
												<div className="flex flex-row  items-center justify-between m-[5px] ml-[20px] mr-0">
													<div className="flex flex-row items-start justify-start" style={{ fontSize: "20px"}}>
														{item.amount}
													</div>
													<div className="flex flex-row items-center justify-center text-sm text-muted-foreground">-{'>'} {item.toAccountTitle}</div>
												</div>
												}
												<div className="flex justify-end text-sm text-muted-foreground">
													Balance: 100
												</div>
												<div className="w-[300px] h-[0px] m-[5px] " style={{ borderBottom: '0.5px solid #9494944d', display: "grid", justifySelf: "center" }}></div>
											</div>
										</div>
									</DialogTrigger>
									<DialogContent>
									{transactionData ?
										<>
										<Tabs defaultValue={transactionData.accountId} className="h-[80%] w-[526px]">
											<ScrollArea className="h-[50px] w-[100%] p-1">
													<TabsList className="flex justify-center align-center items-center">
															<div className="flex flex-row justify-between align-center">
																{userData.accounts.length > 0 ?
																	userData.accounts.map((account, index) => {
																	return (
																		<TabsTrigger 
																			name="account"
																			key={index} 
																			value={account._id}
																			className="ml-1 mr-1"
																			style={{ color: account.accountColor }}
																			onClick={() => {setTransactionData((prevData) => ({...prevData, accountId: account._id}))}}
																			>{account.accountTitle}
																		</TabsTrigger>
																	)
																})
																:
																<div/>
																}
															</div>
															
													</TabsList>
												<ScrollBar orientation="horizontal" />
											</ScrollArea>
												
										</Tabs>
											<div className="m-2">
												<div className="m-2 mt-0 flex justify-center align center">
													<Input 
													style={{ height: '70px', width: '60%', fontSize: '30px', textAlign: 'center' }} 
													className="flex justify-center align-center" 
													type="number" 
													min="0" 
													placeholder="Transaction Amount" 
													name="amount" 
													value={transactionData.amount} 
													onChange={(e) => {setTransactionData((prevData) => ({...prevData, amount: e.target.value}))}}>

													</Input>
												</div>
												<div className="flex flex-row justify-start items-start mt-10">
													<div className="flex flex-col justify-start items-start">
														<div className="flex items-center m-2 ml-1">
															<RadioGroup name="type" defaultValue={transactionData.type} className="flex flex-row items-center">
																<div className="flex items-center space-x-2">
																	<RadioGroupItem name= "type" value="expense" id="expense" onClick={() => {setTransactionData((prevData) => ({...prevData, type: "expense"}))}}/>
																	<Label htmlFor="expense">Expense</Label>
																</div>
																<div className="flex items-center space-x-2">
																	<RadioGroupItem name= "type" value="income" id="income" onClick={() => {setTransactionData((prevData) => ({...prevData, type: "income"}))}}/>
																	<Label htmlFor="income">Income</Label>
																</div>
																<div className="flex items-center space-x-2">
																	<RadioGroupItem name= "type" value="transfer" id="transfer" onClick={() => {setTransactionData((prevData) => ({...prevData, type: "transfer"}))}}/>
																	<Label htmlFor="transfer">Transfer</Label>
																</div>
															</RadioGroup>
														</div>
														<div>
															<ScrollArea className="h-[298px] w-[231.36px] rounded-md border p-4 mr-6">
																<RadioGroup name="category" defaultValue={transactionData.categoryId}>
																	{( ( transactionData.type === "expense") && (userData.categories.length > 0) ) ?
																	userData.categories.map((category, index) => {
																		if (category.categoryType === "expense") {
																			return (
																			<div className="flex flex-row align-center justify-start h-5" key={index}>
																				{/* <div className="flex items-center space-x-2"> */}
																				{/* <div  color={category.categoryColor} className={`w-1.5 h-4 mr-1 rounded-md colorDiv justify-center`} style={{backgroundColor: `${category.categoryColor}`}}></div> */}
																				<RadioGroupItem style={{ backgroundColor: category.categoryColor }} className="mr-2" name="category" value={category._id} id={index} 
																					onClick={() => {setTransactionData(prevData => ({
																						...prevData, 
																						categoryId: category._id, 
																						toAccountId: "", 
																						fromAccountId: ""
																						}))
																					}}>

																				</RadioGroupItem>
																				<Label htmlFor={index}>{category.categoryTitle}</Label>
																				{/* </div> */}
																			</div>
																			)
																		} 
																	})
																	: ( (transactionData.type === "income") && (userData.categories.length > 0) ) ?
																	userData.categories.map((category, index) => {
																		if (category.categoryType === "income") {
																			return (
																			<div className="flex flex-row align-center justify-start h-5" key={index}>
																				{/* <div className="flex items-center space-x-2"> */}
																				{/* <div  color={category.categoryColor} className={`w-1.5 h-4 mr-1 rounded-md colorDiv justify-center`} style={{backgroundColor: `${category.categoryColor}`}}></div> */}
																				<RadioGroupItem style={{ backgroundColor: category.categoryColor }} className="mr-2" name="category" value={category._id} id={index} 
																					onClick={() => {setTransactionData(prevData => ({
																						...prevData, 
																						categoryId: category._id, 
																						toAccountId: "",
																						fromAccountId: ""
																						})) 
																					}}>

																				</RadioGroupItem>
																				<Label htmlFor={index}>{category.categoryTitle}</Label>
																				{/* </div> */}
																			</div>
																			)
																		}
																	})
																	: ( (transactionData.type === "transfer") && (userData.accounts.length > 0) ) ?
																	<>
																		<div className="mb-2">Transfer to Account</div>
																		{userData.accounts.map((account, index) => {
																			return (
																			<div className="flex flex-row align-center justify-start h-5" key={index}>
																				{/* <div className="flex items-center space-x-2"> */}
																				{/* <div  color={account.accountColor} className={`w-1.5 h-4 mr-1 rounded-md colorDiv justify-center`} style={{backgroundColor: `${account.accountColor}`}}></div> */}
																				<RadioGroupItem style={{ backgroundColor: account.accountColor }} className="mr-2" name="account" value={account._id} id={index} 
																					onClick={() => {setTransactionData(prevData => ({...prevData, toAccountId: account._id, fromAccountId: ""}))
																					// const {categoryId, ...rest} = transactionData;
																					// setTransactionData(rest);
																					}}>
																				</RadioGroupItem>
																				<Label htmlFor={index}>{account.accountTitle}</Label>
																				{/* </div> */}
																			</div>
																			)})
																		}
																	</>
																	:
																	<div>Nothing to SHow Here ...</div>
																	}
																</RadioGroup>
															</ScrollArea>
														</div>
													</div>
													<div className=" m-2">
														<Calendar
															mode="single"
															selected={transactionData.date}
															// onSelect={setDate}
															name="date"
															value={transactionData.date}
															initialFocus
															disabled={(date) =>
																date > new Date() || date < new Date("1900-01-01")
															}
															onSelect={(date) => {setTransactionData(prevData => ({...prevData, date: date}))}}
															className="rounded-md border h-[322px] w-[250px]"
														/>
													</div>
												</div>
												<div className="flex flex-col align-center justify-center mt-4">
													<Label className="mb-1 ml-1">Description</Label>
													<Input className="w-[508px] h-[70px]" name="description" value={transactionData.description} onChange={(e) => {setTransactionData(prevData => ({...prevData, description: e.target.value}))}}>

													</Input>
												</div>
												<div className="flex justify-between align-center m-2 mt-7">
													<Dialog className="max-w-m" >
														<DialogTrigger>
															<Badge className="w-[100px] h-[38px] flex justify-center items-center" variant="outline">
																<p style={{ fontSize: 'small', margin: '0' }}>Delete</p>
															</Badge>
															{/* <Button variant="outline">
																Delete
															</Button> */}
														</DialogTrigger>
														<DialogContent className="flex flex-col">
															<DialogHeader>
															<DialogTitle>Are you sure you want to delete the transaction?</DialogTitle>
															<DialogDescription>
																This action cannot be undone. This will permanently delete the transaction.
															</DialogDescription>
															</DialogHeader>
															<DialogFooter >
																<DialogClose asChild>
																	<div className="flex flex-row justify-between">
																	{/* <Badge className="w-[100px] h-[38px] flex justify-center items-center" variant="outline">
																		<p style={{ fontSize: 'small', margin: '0' }}>Cancel</p>
																	</Badge>
																	<Badge className="w-[100px] h-[38px] flex justify-center items-center ml-[10px]" variant="destructive">
																		<p style={{ fontSize: 'small', margin: '0' }}>Delete</p>
																	</Badge> */}
																		<Button className="w-[100px] flex align-end items-end" variant="outline">
																			cancel
																		</Button>
																		<Button className="w-[100px] flex align-end items-end ml-[10px]" variant="destructive" onClick={() => deleteTransaction()}>
																			delete
																		</Button>
																	</div>
																</DialogClose>
															</DialogFooter>
														</DialogContent>
													</Dialog>
													
													<DialogClose asChild>
														{/* <Badge className="w-[120px] h-[38px] align-end items-center"  onClick={submitChanges}>
															<p style={{ fontSize: 'small', margin: '0' }}>Save Changes</p>
														</Badge> */}
														<Button variant="default" onClick={submitChanges}>
															Save Changes
														</Button>
													</DialogClose>
												</div>
											</div>
										</>
								: <div>Loading ...</div>
							}
									</DialogContent>
								</Dialog>
							))
						:
						<></>
						}
						
					</ScrollArea>
					{/* <div style={{ flexGrow: 1 }}></div> */}
					<Pagination className="felx justify-center align-end items-end mt-[10px]">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious onClick={(e) => { handlePaginationClick(e, currentPage - 1); e.preventDefault() }} href="#" />
							</PaginationItem>
        					{generatePaginationLinks(totalPages)}
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
							<PaginationItem>
								<PaginationNext onClick={(e) => { (currentPage < totalPages ? handlePaginationClick(e, currentPage + 1) : null); e.preventDefault() }} href="#" />
							</PaginationItem>
						</PaginationContent>
					</Pagination>

                </CardContent>
            </Card>
        </div>
    )
}

export function IncomeSankey() {
	// context variable
	const { apiUrl, update, config, userData, setUserData, token, userId, balanceData, getBalances, getProfileData  } = useContext(DataContext)

	const [sankeyData, setSankeyData] = useState(null);
	const [ period, setPeriod ] = useState("this_month");
	const [loading, setLoading] = useState(true);
	
	async function getSankeyData(dataPeriod) {
		try {
			const result = await axios.get(apiUrl+'/api/balance/sankey/'+userId+`?period=${dataPeriod}`, config);
			console.log(result.data.sankeyData)

			if ((result.status === 200) && (userData.accounts.length > 0) && (userData.categories.length > 0) && result.data.sankeyData) {
				let tempAccounts = {}
				userData.accounts.map(account => {
					tempAccounts[account._id] = {color: account.accountColor, title: account.accountTitle}
				});
				let tempCategories = {}
				userData.categories.map(category => {
					tempCategories[category._id] = {color: category.categoryColor, title: category.categoryTitle}
				});
	
				let nodes = []
				let links = []
				let outflowAmount = 0
				let incomeAmount = 0
				result.data.sankeyData.forEach(data => {
					if (data.type === "initial" && tempAccounts[data.accountId]) { // accounts
						const amount = data.totalAmount;
						if (amount >= 0) {
							nodes.push({ id: `${tempAccounts[data.accountId].title} (initial)`, nodeColor: tempAccounts[data.accountId].color })
							links.push({ source: `${tempAccounts[data.accountId].title} (initial)`, target: "Inflow", value:  amount})
						} else if (amount < 0 ) {
							if ( nodes.map(node => ((node.id === "Old Debts") && node.id !== tempAccounts[data.accountId].title)) ) {
								nodes.push({ id: `${tempAccounts[data.accountId].title} (initial)`, nodeColor: tempAccounts[data.accountId].color })
								nodes.push({ id: "Old Debts", nodeColor: red })
								// links.push({ source: `${tempAccounts[data.accountId].title} (initial)`, target: "Old Debts", value:  -amount})
								// links.push({ source: "Old Debts", target: "Inflow", value:  -amount})
								links.push({ source: "Inflow", target: "Old Debts", value:  -amount})
								links.push({ source: "Old Debts", target: `${tempAccounts[data.accountId].title} (initial)`, value:  -amount})
							} else if (nodes.map(node => (node.id === "Old Debts"))) {
								links.push({ source: "Inflow", target: "Old Debts", value:  -amount})
								links.push({ source: "Old Debts", target: `${tempAccounts[data.accountId].title} (initial)`, value:  -amount})
							}
							
						}
						
					} else if (data.type === "final" && tempAccounts[data.accountId]) { // accounts
						const amount = data.totalAmount;
						if (amount >= 0) {
							nodes.push({ id: tempAccounts[data.accountId].title, nodeColor: tempAccounts[data.accountId].color })
							links.push({ source: "Total Income", target: tempAccounts[data.accountId].title, value:  amount})
						} else if (amount < 0) {
							nodes.push({ id: tempAccounts[data.accountId].title, nodeColor: tempAccounts[data.accountId].color })
							nodes.push({ id: "Current Debts", nodeColor: red })
	
							links.push({ source: tempAccounts[data.accountId].title, target: "Current Debts", value:  amount})
							links.push({ source: "Current Debts", target: "Inflow", value:  amount})
						}
						incomeAmount += (amount > 0 ? amount : -amount);
						
					} else if (data.type === "income" && tempCategories[data.categoryId]) { // categories
						const amount = data.totalAmount;
						nodes.push({ id: tempCategories[data.categoryId].title, nodeColor: tempCategories[data.categoryId].color })
						links.push({ source: tempCategories[data.categoryId].title, target: "Inflow", value:  amount})
						
					} else if (data.type === "expense" && tempCategories[data.categoryId]) { // categories
						const amount = data.totalAmount;
						outflowAmount += (amount > 0 ? amount : -amount);
						nodes.push({ id: tempCategories[data.categoryId].title, nodeColor: tempCategories[data.categoryId].color })
						links.push({ source: "Outflow", target: tempCategories[data.categoryId].title, value:  amount})
	
					} else {
						console.log("type undefined")
					}
				})
				nodes.push({ id: "Inflow", nodeColor: green }, { id:"Outflow", nodeColor: red }, { id:"Total Income", nodeColor: green });
				links.push({ source: "Inflow", target: "Outflow", value: outflowAmount }, { source: "Inflow", target: "Total Income", value: incomeAmount })
				setSankeyData({ nodes, links })
				console.log({ nodes, links })
				// nodes = [];
				// links = [];
				setLoading(false)
			} else {
				setLoading(true)
			}
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	useEffect(() => {
		setLoading(true);
		
		// getSankeyData(period);
	}, [userData, update])

	
	if (loading) {
		return(
			<Skeleton className="w-[951.3px] h-[650px]"></Skeleton>
		)
	}
	return (
      <div>
			<Card  className="w-[951.3px] h-[650px] flex flex-col align-stretch justify-stretch">
				<div className=" flex flex-row justify-between items-center">
					<CardHeader className="w-[50%] flex items-start" >
						<CardTitle >
							Cash Flow
						</CardTitle>
					</CardHeader>
					<Select onValueChange={(value) => {setPeriod(value); getSankeyData(value)}} defaultValue={period}>
						<SelectTrigger className="w-[130px] mt-[15px] mr-[30px]">
							<SelectValue placeholder="Choose Period"/>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="this_week">This Week</SelectItem>
							<SelectItem value="this_month">This Month</SelectItem>
							<SelectItem value="last_3_months">Last 3 Months</SelectItem>
							<SelectItem value="last_6_months">Last 6 Months</SelectItem>
							<SelectItem value="this_year">This Year</SelectItem>
							<SelectItem value="last_3_years">Last 3 Years</SelectItem>
							<SelectItem disabled={true} value="max">Custom</SelectItem>
							{/* <SelectItem onClick={() => setPeriod(value)} value="custom">Custom</SelectItem> */}
						</SelectContent>
					</Select>
				</div>
                <CardContent className="flex justify-center items-center w-[100%] h-[100%]" >
					<ResponsiveSankey
						data={sankeyData}
						margin={{ top: 40, right: 50, bottom: 40, left: 50 }}
						align="justify"
						// colors={{ scheme: 'category10' }}
						colors={ node => node.nodeColor }
						nodeOpacity={1}
						nodeHoverOthersOpacity={0.35}
						nodeThickness={14}
						nodeSpacing={24}
						nodeBorderWidth={0}
						nodeBorderColor={{
							from: 'color',
							modifiers: [
								[
									'darker',
									0.8
								]
							]
						}}
						nodeBorderRadius={2}
						linkOpacity={0.5}
						linkHoverOthersOpacity={0.1}
						linkContract={3}
						enableLinkGradient={true}
						labelPosition="outside"
						labelOrientation="vertical"
						labelPadding={16}
						// borderColor={{ theme: 'background' }}
						labelTextColor={{
							from: 'color',
							modifiers: [
								[
									'darker',
									1
								]
							]
						}}
						// legends={[
						// 	{
						// 		anchor: 'bottom-right',
						// 		direction: 'column',
						// 		translateX: 130,
						// 		itemWidth: 100,
						// 		itemHeight: 14,
						// 		itemDirection: 'right-to-left',
						// 		itemsSpacing: 2,
						// 		itemTextColor: '#999',
						// 		symbolSize: 14,
						// 		effects: [
						// 			{
						// 				on: 'hover',
						// 				style: {
						// 					itemTextColor: '#000'
						// 				}
						// 			}
						// 		]
						// 	}
						// ]}
						linkColor={(link) => link.source.nodeColor}
				/>
                </CardContent>
            </Card>
      </div>
    )
}
