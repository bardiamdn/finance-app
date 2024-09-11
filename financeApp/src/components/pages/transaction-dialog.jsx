import React, {
  useContext,
  useState,
  useLayoutEffect,
  useReducer,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "sonner";

// components
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";

// context
import { DataContext } from "@/Home";

import { FaPlus } from "react-icons/fa";

export function AddTransaction() {
  // context variable
  const {
    apiUrl,
    setUpdate,
    config,
    userData,
    token,
    userId,
    dialogIsOpen,
    setDialogIsOpen,
  } = useContext(DataContext);
  // loading userData
  const [loading, setLoading] = useState(true);
  // states
  const [transactionData, setTransactionData] = useState({
    userId: userId,
    _id: "",
    accountId: "",
    toAccountId: "",
    fromAccountId: "",
    type: "expense",
    categoryId: "",
    amount: 0,
    date: new Date(),
    description: "",
  });

  // effect for loading the useData
  useEffect(() => {
    setLoading(true);
    if (
      userData &&
      userData.accounts.length > 0 &&
      userData.categories.length > 0
    ) {
      setTransactionData({
        userId: userId,
        accountId: userData.accounts.length > 0 ? userData.accounts[0]._id : "",
        toAccountId: "",
        fromAccountId: "",
        type: "expense",
        categoryId:
          userData.categories.length > 0 ? userData.categories[0]._id : "",
        amount: 0,
        date: new Date(),
        description: "",
      });
      setLoading(false);
    }
  }, [userData]);

  const formInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function submitTransaction() {
    // setTransactionData((prevData) => ({...prevData, date: date}))
    try {
      if (
        userId &&
        token &&
        (transactionData.categoryId !== "" ||
          transactionData.toAccountId !== "") &&
        transactionData.accountId !== "" &&
        transactionData.amount !== 0
      ) {
        const response = await axios.post(
          apiUrl + "/api/transaction/create",
          transactionData,
          config
        );

        setTransactionData({
          userId: userId,
          accountId:
            userData.accounts.length > 0 ? userData.accounts[0]._id : "",
          toAccountId: "",
          fromAccountId: "",
          type: "expense",
          categoryId:
            userData.categories.length > 0 ? userData.categories[0]._id : "",
          amount: 0,
          date: new Date(),
          description: "",
        });
        setUpdate((prevState) => !prevState);
        toast("Event has been created", {
          description: `Your ${response.data.data.type} was ${
            response.data.data.amount
          }$ on ${response.data.data.date.split("T")[0]}`,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
      } else {
        toast("Error creating the transaction", {
          // description: `amount: ${response.data.amount}`,
        });

        console.log("Missing Data");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  }

  if (loading) {
    return <Skeleton className="w-[180px] h-[40px]"></Skeleton>;
  }
  return (
    <Dialog onOpenChange={(open) => setDialogIsOpen(open)}>
      {!dialogIsOpen && (
        <DialogTrigger as="button" className="w-[200px] h-[50px]">
          <Badge className="w-full h-full flex justify-center items-center rounded-xl p-2">
            <FaPlus className="mr-1 h-6 w-6" />
            <p style={{ margin: "0" }} className="text-lg font-semibold">
              Add Transaction
            </p>
          </Badge>
        </DialogTrigger>
      )}
      <DialogContent className="h-[80%%] w-[100%]">
        {userData.accounts.length > 0 ? (
          <Tabs
            defaultValue={transactionData.accountId}
            className="h-[80%] w-[526px]"
          >
            <ScrollArea className="h-[50px] w-[100%] p-1">
              <TabsList className="flex justify-center align-center items-center">
                <div className="flex flex-row justify-between align-center">
                  {userData.accounts.map((account, index) => {
                    return (
                      <TabsTrigger
                        name="account"
                        key={index}
                        value={account._id}
                        className="ml-1 mr-1"
                        style={{ color: account.accountColor }}
                        onClick={() => {
                          setTransactionData((prevData) => ({
                            ...prevData,
                            accountId: account._id,
                          }));
                        }}
                      >
                        {account.accountTitle}
                      </TabsTrigger>
                    );
                  })}
                </div>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Tabs>
        ) : (
          <div>There is no accounts, you must have at least one</div>
        )}
        <div className="m-2">
          <div className="m-2 mt-0 flex justify-center align center">
            <Input
              style={{
                height: "70px",
                width: "60%",
                fontSize: "30px",
                textAlign: "center",
              }}
              className="flex justify-center align-center"
              type="number"
              min="0"
              placeholder="Transaction Amount"
              name="amount"
              value={transactionData.amount}
              onChange={(e) => {
                setTransactionData((prevData) => ({
                  ...prevData,
                  amount: e.target.value,
                }));
              }}
            ></Input>
          </div>
          <div className="flex flex-row justify-start items-start mt-10">
            <div className="flex flex-col justify-start items-start">
              <div className="flex items-center m-2 ml-1">
                <RadioGroup
                  name="type"
                  defaultValue="expense"
                  className="flex flex-row items-center"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      name="type"
                      value="expense"
                      id="expense"
                      onClick={() => {
                        setTransactionData((prevData) => ({
                          ...prevData,
                          type: "expense",
                        }));
                      }}
                    />
                    <Label htmlFor="expense">Expense</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      name="type"
                      value="income"
                      id="income"
                      onClick={() => {
                        setTransactionData((prevData) => ({
                          ...prevData,
                          type: "income",
                        }));
                      }}
                    />
                    <Label htmlFor="income">Income</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      name="type"
                      value="transfer"
                      id="transfer"
                      onClick={() => {
                        setTransactionData((prevData) => ({
                          ...prevData,
                          type: "transfer",
                        }));
                      }}
                    />
                    <Label htmlFor="transfer">Transfer</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <ScrollArea className="h-[298px] w-[231.36px] rounded-md border p-4 mr-6">
                  <RadioGroup
                    name="category"
                    defaultValue={transactionData.categoryId}
                  >
                    {userData.categories.length > 0 ? (
                      transactionData.type === "expense" ? (
                        userData.categories.map((category, index) => {
                          if (category.categoryType === "expense") {
                            return (
                              <div
                                className="flex flex-row align-center justify-start h-5"
                                key={index}
                              >
                                {/* <div className="flex items-center space-x-2"> */}
                                {/* <div  color={category.categoryColor} className={`w-1.5 h-4 mr-1 rounded-md colorDiv justify-center`} style={{backgroundColor: `${category.categoryColor}`}}></div> */}
                                <RadioGroupItem
                                  style={{
                                    backgroundColor: category.categoryColor,
                                  }}
                                  className="mr-2"
                                  name="category"
                                  value={category._id}
                                  id={index}
                                  onClick={() => {
                                    setTransactionData((prevData) => ({
                                      ...prevData,
                                      categoryId: category._id,
                                      toAccountId: "",
                                      fromAccountId: "",
                                    }));
                                  }}
                                ></RadioGroupItem>
                                <Label htmlFor={index}>
                                  {category.categoryTitle}
                                </Label>
                                {/* </div> */}
                              </div>
                            );
                          }
                        })
                      ) : transactionData.type === "income" ? (
                        userData.categories.map((category, index) => {
                          if (category.categoryType === "income") {
                            return (
                              <div
                                className="flex flex-row align-center justify-start h-5"
                                key={index}
                              >
                                {/* <div className="flex items-center space-x-2"> */}
                                {/* <div  color={category.categoryColor} className={`w-1.5 h-4 mr-1 rounded-md colorDiv justify-center`} style={{backgroundColor: `${category.categoryColor}`}}></div> */}
                                <RadioGroupItem
                                  style={{
                                    backgroundColor: category.categoryColor,
                                  }}
                                  className="mr-2"
                                  name="category"
                                  value={category._id}
                                  id={index}
                                  onClick={() => {
                                    setTransactionData((prevData) => ({
                                      ...prevData,
                                      categoryId: category._id,
                                      toAccountId: "",
                                      fromAccountId: "",
                                    }));
                                  }}
                                ></RadioGroupItem>
                                <Label htmlFor={index}>
                                  {category.categoryTitle}
                                </Label>
                                {/* </div> */}
                              </div>
                            );
                          }
                        })
                      ) : transactionData.type === "transfer" ? (
                        <>
                          <div className="mb-2">Transfer to Account</div>
                          {userData.accounts.map((account, index) => {
                            return (
                              <div
                                className="flex flex-row align-center justify-start h-5"
                                key={index}
                              >
                                {/* <div className="flex items-center space-x-2"> */}
                                {/* <div  color={account.accountColor} className={`w-1.5 h-4 mr-1 rounded-md colorDiv justify-center`} style={{backgroundColor: `${account.accountColor}`}}></div> */}
                                <RadioGroupItem
                                  style={{
                                    backgroundColor: account.accountColor,
                                  }}
                                  className="mr-2"
                                  name="account"
                                  value={account._id}
                                  id={index}
                                  onClick={() => {
                                    setTransactionData((prevData) => ({
                                      ...prevData,
                                      toAccountId: account._id,
                                      fromAccountId: "",
                                    }));
                                    // const {categoryId, ...rest} = transactionData;
                                    // setTransactionData(rest);
                                  }}
                                ></RadioGroupItem>
                                <Label htmlFor={index}>
                                  {account.accountTitle}
                                </Label>
                                {/* </div> */}
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div>Nothing to SHow Here ...</div>
                      )
                    ) : (
                      <div>You don't have any categories</div>
                    )}
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
                // value={transactionData.date}
                // initialFocus
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                onSelect={(date) => {
                  // const now = new Date()
                  date.setHours(12);
                  date.setMinutes(0);
                  date.setSeconds(0);
                  date.setMilliseconds(0);
                  setTransactionData((prevData) => ({
                    ...prevData,
                    date: date,
                  }));
                }}
                className="rounded-md border h-[322px] w-[250px]"
              />
            </div>
          </div>
          <div className="flex flex-col align-center justify-center mt-4">
            <Label className="mb-1 ml-1">Description</Label>
            <Input
              className="w-[508px] h-[70px]"
              name="description"
              value={transactionData.description}
              onChange={(e) => {
                setTransactionData((prevData) => ({
                  ...prevData,
                  description: e.target.value,
                }));
              }}
            ></Input>
          </div>
          <div className="flex justify-center align-center m-2 mt-7">
            <Button
              variant="default"
              onClick={() => {
                submitTransaction();
                // toast("Event has been created", {
                // 	description: "Sunday, December 03, 2023 at 9:00 AM",
                // 	action: {
                // 		label: "Undo",
                // 		onClick: () => console.log("Undo"),
                // 	},
                // })
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
}
