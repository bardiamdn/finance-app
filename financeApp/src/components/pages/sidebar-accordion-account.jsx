import React, {useState, useContext, createContext, useEffect} from "react"
import axios from "axios";

// components
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
  
// context
import { DataContext } from "@/home";

// colors
import { colors, myColors } from "@/components/ui/colors"
// icons
import { FiEdit3, FiEdit2 } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { LuPlus } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { GoTrash } from "react-icons/go";



export function SidebarAccordionAccount() {
    
    // context variable
    const { apiUrl, config, userData, setUserData, token, userId } = useContext(DataContext);

    // states variables
    const [editClicked, setEditClicked] = React.useState(false);
    const [addClicked, setAddClicked] = React.useState(false);
    //accounts
    const [accounts, setAccounts] = useState([])
    // Add
    const [selectedColor, setSelectedColor] = useState('#7c7c7cb0');
    const [newTitle, setNewTitle] = useState(null)
    //update
    const [updatedAccount, setUpdatedAccount] = useState([])
    // Loading
    const [loading, setLoading] = useState('false');
    // variables
    // const apiUrl = 'http://localhost:3000';
    // const apiUrl = 'http://192.168.1.111:3000';
    // const config = {
    //     headers: {
    //         Authorization: token,
    //         'Content-Type': 'application/json'
    //     },
    // };

    // on clicks
    const onEditClick = () => {
        setEditClicked(prevState => !prevState)
    }
    const onAddClick = () => {
        setAddClicked(prevState => !prevState)
    }
    const onPageClick = (e) => {
        const isButton = e.target.tagName === 'BUTTON';
        const isInput = e.target.tagName === 'INPUT';
        const isColor = e.target.classList.contains('colorDiv');
        const isTrash = e.target.classList.contains('trashBtn');
        const isDropdownMenu = e.target.closest('.dropdown-menu');
        // const goTrash = e.target.tagName === 'SVGElement';

        // If clicked element is not a button, input, or div, close edit/add mode
        if (!isButton && !isInput && !isColor && !isTrash && !isDropdownMenu) {
            if (addClicked || editClicked){
                setAddClicked(false);
                setEditClicked(false);
            }
        }
    }

    const inputChange = (accountId, newTitle) => {
        const updatedUserData = {
            ...userData,
            accounts: userData.accounts.map(account => {
                if (account._id === accountId) {
                    return { ...account, accountTitle: newTitle };
                }
                return account;
            })
        };
        setUserData(updatedUserData);
        
        // save changes in the updatedAccount in order to send to the API on save clicked
        // if (!updatedAccount.some(item => item.accountId === accountId)) {

        //     setUpdatedAccount(prevAccountData => [
        //         ...prevAccountData,
        //         {
        //             accountId: accountId,
        //             data: {
        //                 accountTitle: newTitle
        //             }
        //         }
        //     ]);
        // } else {
        //     setUpdatedAccount(prevAccountData => [
        //         ...prevAccountData.map(account => {
        //             if (account.accountId === accountId) {
        //                 return { ...account, data:{ ...account.data, accountTitle: newTitle } }
        //             } else {
        //                 return account;
        //             }
        //         })
        //     ]);
        // };
        console.log("UPDATED ACCOUNT", updatedAccount)
    };
    const colorChange = (accountId, newColor) => {
        const updatedUserData = {
            ...userData,
            accounts: userData.accounts.map(account => {
                if (account._id === accountId) {
                    return { ...account, accountColor: newColor };
                }
                return account;
            })
        };
        setUserData(updatedUserData);
        
        // save changes in the updatedAccount in order to send to the API on save clicked
        // if (!updatedAccount.some(item => item.accountId === accountId)) {

        //     setUpdatedAccount(prevAccountData => [
        //         ...prevAccountData,
        //         {
        //             accountId: accountId,
        //             data: {
        //                 accountColor: newColor
        //             }
        //         }
        //     ]);
        // } else {
        //     setUpdatedAccount(prevAccountData => [
        //         ...prevAccountData.map(account => {
        //             if (account.accountId === accountId) {
        //                 return { ...account, data:{ ...account.data, accountColor: newColor } }
        //             } else {
        //                 return account;
        //             }
        //         })
        //     ]);
        // };
        // console.log("UPDATED ACCOUNT", updatedAccount)
    };

    // add account to API
    async function addNewAccount() {
        // getStorageVariables();
        const data = {
            accountTitle: newTitle,
            accountColor: selectedColor,
        }
        try {
            if(token && userId && newTitle && selectedColor) {
                await axios.put(apiUrl+'/api/profile/add-account/'+userId, data, config)
                .then(response => {
                    
                    // window.location.reload();
                    console.log(response)
                    setUserData(response.data.data);
                })
                setNewTitle(null);
            }
        } catch(error) {
            console.error('Error posting data:', error);
        }
        setAddClicked(prevState => !prevState)
    }

    async function editAccount() {
        try {
            if(token && userId) {
                // console.log("userData from Sidebar Accounts", userData)
                // console.log("updatedAccount from Sidebar Accounts", updatedAccount)
                await axios.put(apiUrl+'/api/profile/update-account/'+userId, userData, config)
                .then(response => {
                    setUserData(response.data.data)
                    // window.location.reload();
                    console.log(response);
                })
                // setUserData(response.data.data);
            }
        } catch(error) {
            console.error('Error posting data:', error);
        }
        // setUpdatedAccount([]);
        setEditClicked(prevState => !prevState)    
    }
    // delete account to API
    async function deleteAccount(id) {
        try {
            if (token && userId) {
                await axios.delete(`${apiUrl}/api/profile/remove-account/${userId}/?accountId=${id}`, config)
                .then(response => {
                    console.log(response);
                    setUserData(response.data.data)
                })
            }
        } catch(error) {
            console.error('Error posting data:', error);
        }
    }

    // loading until useData is loaded
    useEffect(() => {
		setLoading(true);
        
		if(userData) {
			setLoading(false);
		}
	}, [userData]);
	if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            {/* <Accordion type="single" collapsible> */}
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        Accounts
                    </h4>
                    </AccordionTrigger>
                    {/* <AccordionContent onClick={onPageClick}> */}
                    <AccordionContent>
                        {
                            userData && userData.accounts ? (
                                userData.accounts.map((item, index) => (
                                    editClicked ? 
                                    <div key={index} className="flex justify-between items-center h-50 ml-2" 
                                    style={{ width: '95%', height: '50px'}}>
                                        {/* color box */}
                                        <DropdownMenu className="colorDiv">
                                            <DropdownMenuTrigger>
                                                <div color={item.accountColor} className={`w-8 h-7 rounded-md mr-2 colorDiv`} style={{backgroundColor: `${item.accountColor}`}}></div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>
                                                <div className="flex justify-between items-center">
                                                    Current Color
                                                    <div className={`w-8 h-7 rounded-md mr-2 colorDiv`} style={{backgroundColor: `${item.accountColor}`}}></div>
                                                </div>
                                                </DropdownMenuLabel>
                                                {/* <DropdownMenuSeparator /> */}
                                                <ScrollArea className="h-72 w-[200px] rounded-md border">
                                                    <div className="grid grid-cols-4 gap-[1px]">
                                                        {myColors ?
                                                            myColors.map((color, index) => (
                                                            <DropdownMenuItem key={color.value} onClick={() => colorChange(item._id, color.value)}>
                                                                <div className="flex justify-center items-center">
                                                                    <div className="w-8 h-7 rounded-md colorDiv" style={{backgroundColor: `${color.value}`}}></div>
                                                                </div>
                                                                {index % 4 === 3 && <div className="w-full"></div>} {/* Add a new row after every four items */}
                                                            </DropdownMenuItem>
                                                            ))
                                                            :
                                                            <div></div>
                                                            }
                                                    </div>
                                                </ScrollArea>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <Input value={item.accountTitle || ''} key={index} onChange={
                                            (e) => {
                                                inputChange(item._id, e.target.value)
                                            }
                                        }>
                                        </Input>
                                        
                                        <AlertDialog>
                                            <AlertDialogTrigger className="trashBtn">
                                            
												{/* <Badge className="h-[36px] w-[36px] ml-[5px] flex flex justify-end items-center trashBtn" variant="ghost"> */}
													{/* <p style={{ fontSize: 'small', margin: '0' }}>Delete</p> */}
                                                    <GoTrash className="h-4 w-4 ml-[10px] trashBtn flex flex justify-end items-center"/>
												{/* </Badge> */}
                                                    {/* <Button variant="ghost" className="flex justify-end items-center trashBtn">
                                                    </Button> */}
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure you want to delete {item.accountTitle} and it's transactions?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete this account and related transcations.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction variant="destructive" onClick={() => deleteAccount(item._id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        
                                    </div> :
                                    <div key={index} className="flex justify-start items-center ml-2">
                                        {/* color box */}
                                        <div  color={item.accountColor} className={`w-1.5 h-7 rounded-md colorDiv`} style={{backgroundColor: `${item.accountColor}`}}></div>

                                        <Button variant="link"  key={index} className="flex justify-start items-center" style={{ width: '100%', height: '50px'}}>
                                                {item.accountTitle}
                                        </Button>
                                    </div> 
                                ))
                            ) : (
                                console.log("Can't Get the Fuucking userData.accounts")
                            )
                        }
                        {
                        addClicked ? 
                        <div  className="flex justify-end items-center mt" style={{ width: '95%', height: '50px'}}>
                            
                            
                        <DropdownMenu className="colorDiv">
                            <DropdownMenuTrigger>
                                <div className={`w-8 h-7 rounded-md mr-2 colorDiv`} style={{backgroundColor: selectedColor}}></div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                <div className="flex justify-between items-center">
                                    Current Color
                                    <div className={`w-8 h-7 rounded-md colorDiv`} style={{backgroundColor: selectedColor}}></div>
                                    {/* <div className={`w-8 h-7 rounded-md mr-2 colorDiv`} style={{backgroundColor: `${item.accountColor}`}}></div> */}
                                </div>
                                </DropdownMenuLabel>
                                {/* <DropdownMenuSeparator /> */}
                                <ScrollArea className="h-72 w-[200px] rounded-md border">
                                    <div className="grid grid-cols-4 gap-[1px]">
                                        {myColors ?
                                            myColors.map((color, index) => (
                                            <DropdownMenuItem key={color.value}  onClick={() => setSelectedColor(color.value)}>
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-7 rounded-md colorDiv" style={{backgroundColor: `${color.value}`}}></div>
                                                </div>
                                                {index % 4 === 3 && <div className="w-full"></div>} {/* Add a new row after every four items */}
                                            </DropdownMenuItem>
                                            ))
                                            :
                                            <div></div>
                                            }
                                    </div>
                                </ScrollArea>
                            </DropdownMenuContent>
                        </DropdownMenu>
                            {/* color box */}
                            {/* <div className={`w-8 h-7 rounded-md mr-2 colorDiv bg-blue-500`}></div> */}

                            <Input placeholder={'Account Name'} onChange={(e) => setNewTitle(e.target.value)}>
                            </Input>
                        </div>
                        :
                        <></>
                        }
                        {
                        editClicked ? 
                        <div  className="flex justify-end items-center mt-10">
                            <Button variant="outline" onClick={editAccount}> Save</Button> 
                        </div>
                        : addClicked ?
                        <div  className="flex justify-end items-center mt-10">
                            <Button variant="outline" onClick={addNewAccount}> Add</Button> 

                        </div>
                        :
                        <div  className="flex justify-end items-center mt-10">
                            <Button variant="ghost" disabled={userData.accounts && userData.accounts.length === 0} className="flex justify-end items-center mr-2" onClick={onEditClick}>
                                <FiEdit2 className="h-4 w-4"/>
                            </Button>
                            <Button variant="ghost" className="flex justify-end items-center"  onClick={onAddClick}>
                                <LuPlus className="h-5 w-5" />
                                {/* Add Account */}
                            </Button>
                        </div>
                        }
                    

                        {/* <Button variant="ghost" onClick={onClick}>
                            <MdEdit className="h-5 w-5"></MdEdit>
                        </Button> */}
                    </AccordionContent>
                </AccordionItem>
            {/* </Accordion> */}
        </>
    )
}