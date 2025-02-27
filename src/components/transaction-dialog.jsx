import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { cn } from "../lib/utils";

// components
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Icons
import { Calendar as CalendarIcon } from "lucide-react";

// context
import { ProfileDataContext } from "../context/ProfileDataProvider";

import { FaPlus } from "react-icons/fa";

export function AddTransaction() {
  // context variable
  const { apiUrl, setUpdate, config, userData, userId, dialogIsOpen, setDialogIsOpen } =
    useContext(ProfileDataContext);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [date, setDate] = useState(new Date());
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

  // const formInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setTransactionData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  async function submitTransaction() {
    // setTransactionData((prevData) => ({...prevData, date: date}))
    try {
      if (
        userId &&
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
          description: `Your ${response.data.data.type} was ${response.data.data.amount
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
    <Dialog
      onOpenChange={(open) => setDialogIsOpen(open)}
      className="h-[90%] max-w-[320px] md:max-w-lg lg:max-w-2xl"
    >
      {!dialogIsOpen && (
        <DialogTrigger as="button" className="w-[50px] md:w-[200px] h-[50px]">
          <Badge className="w-full h-full flex justify-center items-center rounded-xl p-2">
            <FaPlus className="md:mr-1 h-6 w-6" />
            <p className="text-lg font-semibold m-0 hidden md:block">
              Add Transaction
            </p>
          </Badge>
        </DialogTrigger>
      )}
      <DialogContent className="h-[90%] max-w-[320px] md:max-w-lg lg:max-w-2xl min-h-[610px]">
        {userData.accounts.length > 0 ? (
          <Tabs
            defaultValue={transactionData.accountId}
            className="h-[80%] w-full max-w-[275px] md:max-w-lg lg:max-w-2xl"
          >
            <ScrollArea className="h-[50px] w-full p-1">
              <TabsList className="flex justify-center items-center">
                <div className="flex flex-row justify-between">
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
          <div>You don&apos;t have any account, you must have at least one</div>
        )}
        <div className="h-full w-full md:m-2 flex flex-col items-center justify-between">
          <div className="mb-2 md:m-2 flex justify-center items-center">
            <Input
              style={{
                fontSize: "30px",
                textAlign: "center",
              }}
              className="flex justify-center align-center w-[250px] md:w-8/12 h-[70px]"
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
            />
          </div>
          <div className="block md:hidden">
            <Popover
              open={popoverOpen}
              onOpenChange={setPopoverOpen}
              modal={true}
            >
              <PopoverTrigger className="w-full" asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !transactionData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {transactionData.date ? (
                    format(transactionData.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={transactionData.date}
                  name="date"
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  onSelect={(date) => {
                    date.setHours(12);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    date.setMilliseconds(0);
                    setTransactionData((prevData) => ({
                      ...prevData,
                      date: date,
                    }));
                  }}
                  className="rounded-md border h-full w-full"
                // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-row justify-center sm:justify-between items-start md:mt-10 mt-2">
            <div className="flex flex-col justify-start items-start">
              <div className="flex items-center m-2 ml-1">
                <RadioGroup
                  name="type"
                  defaultValue={transactionData.type}
                  className="flex flex-row lg:flex-row md:flex-col lg:items-center items-start"
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
              <ScrollArea className="lg:h-[298px] lg:w-[231.36px] md:w-[150px] md:h-[240px] h-[180px] w-full rounded-md border px-2 pt-2 md:px-4 md:pt-4 mr-6">
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
                              className="flex flex-row items-center justify-start"
                              key={index}
                            >
                              <RadioGroupItem
                                style={{
                                  backgroundColor: category.categoryColor,
                                }}
                                className="w-5 h-5 mr-2"
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
                              />
                              <Label htmlFor={index} className="bg:text-lg">
                                {category.categoryTitle}
                              </Label>
                            </div>
                          );
                        }
                      })
                    ) : transactionData.type === "income" ? (
                      userData.categories.map((category, index) => {
                        if (category.categoryType === "income") {
                          return (
                            <div
                              className="flex flex-row items-center justify-start"
                              key={index}
                            >
                              <RadioGroupItem
                                style={{
                                  backgroundColor: category.categoryColor,
                                }}
                                className="w-5 h-5 mr-2"
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
                              />
                              <Label htmlFor={index} className="bg:text-lg">
                                {category.categoryTitle}
                              </Label>
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
                              className="flex flex-row items-center justify-start"
                              key={index}
                            >
                              {account._id === transactionData.accountId ? (
                                <>
                                  <RadioGroupItem
                                    style={{
                                      backgroundColor: account.accountColor,
                                    }}
                                    disabled={true}
                                    className="w-5 h-5 mr-2"
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
                                  <Label
                                    htmlFor={index}
                                    className="bg:text-lg text-gray-600"
                                  >
                                    {account.accountTitle}
                                  </Label>
                                </>
                              ) : (
                                <>
                                  <RadioGroupItem
                                    style={{
                                      backgroundColor: account.accountColor,
                                    }}
                                    className="w-5 h-5 mr-2"
                                    name="account"
                                    value={account._id}
                                    id={index}
                                    onClick={() => {
                                      setTransactionData((prevData) => ({
                                        ...prevData,
                                        toAccountId: account._id,
                                        fromAccountId: "",
                                      }));
                                    }}
                                  ></RadioGroupItem>
                                  <Label htmlFor={index} className="bg:text-lg">
                                    {account.accountTitle}
                                  </Label>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div>Nothing to SHow Here ...</div>
                    )
                  ) : (
                    <div>You don&apos;t have any categories</div>
                  )}
                </RadioGroup>
              </ScrollArea>
            </div>
            <div className="lg:m-2 hidden md:block">
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
          <div className="lg:w[450px] w-full flex flex-col items-center mt-4">
            <Label className="mb-2 ml-1">Description</Label>
            <Textarea
              className="w-full h-[70px]"
              name="description"
              placeholder="Enter more details here."
              value={transactionData.description}
              onChange={(e) => {
                setTransactionData((prevData) => ({
                  ...prevData,
                  description: e.target.value,
                }));
              }}
            />
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
