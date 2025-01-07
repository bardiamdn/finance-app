import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { cn } from "../lib/utils";

// context
import { ProfileDataContext } from "../context/ProfileDataProvider";

//components
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "./ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// Icons
import { Calendar as CalendarIcon } from "lucide-react";

// colors
const green = "#25ff1dbd";
const red = "#ff1d1dbd";

export default function History() {
  // context variable
  const { apiUrl, update, setUpdate, config, userData, userId, setDialogIsOpen } =
    useContext(ProfileDataContext);

  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  async function getHistoryData(URL) {
    try {
      const response = await axios.get(URL, config);
      if (
        response.status === 200 &&
        userData.categories.length > 0 &&
        userData.accounts.length > 0 &&
        response.data.data
      ) {
        let transactionsData = response.data.data;

        const accountIdToInfoMap = userData.accounts.reduce((map, account) => {
          map[account._id] = {
            accountColor: account.accountColor,
            accountTitle: account.accountTitle,
          };
          return map;
        }, {});
        const categoryIdToInfoMap = userData.categories.reduce(
          (map, category) => {
            map[category._id] = {
              categoryColor: category.categoryColor,
              categoryTitle: category.categoryTitle,
            };
            return map;
          },
          {}
        );

        const updatedTransactionData = transactionsData.map((transaction) => {
          const accountColorTitle = accountIdToInfoMap[transaction.accountId];
          const toAccountColorTitle = transaction.toAccountId
            ? accountIdToInfoMap[transaction.toAccountId]
            : "";
          const categoryColorTitle =
            categoryIdToInfoMap[transaction.categoryId];
          return {
            ...transaction,
            ...accountColorTitle,
            ...categoryColorTitle,
            toAccountTitle: toAccountColorTitle.accountTitle,
          };
        });
        updatedTransactionData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setHistoryData(updatedTransactionData);
        setLoading(false);
      } else if (response.status === 204) {
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
      if (userData) {
        setLoading(false);
      }
    }
  }

  // effect for loading the useData
  useEffect(() => {
    setLoading(true);

    getHistoryData(apiUrl + "/api/transaction/read/" + userId);
  }, [userData, update]);

  function submitChanges() {
    const { ...rest } = transactionData;
    const updatedData = { ...rest };

    try {
      if (userId && updatedData) {
        axios
          .put(
            apiUrl + "/api/transaction/update/" + userId,
            updatedData,
            config
          )
          .then((response) => {
            console.log("Updated transaction");
          });
        setUpdate((prevState) => !prevState);
      } else {
        console.log("Missing Data");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  }
  async function deleteTransaction() {
    try {
      const result = await axios.delete(
        apiUrl +
        "/api/transaction/delete/" +
        userId +
        "/" +
        transactionData._id,
        config
      );
      setUpdate((prevState) => !prevState);
      // getHistoryData();
    } catch (error) {
      console.log(error);
    }
  }

  const generatePaginationLinks = (totalPages) => {
    const paginationLinks = [];

    // Include the current page
    paginationLinks.push(
      <PaginationItem key={currentPage}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            handlePaginationClick(e, currentPage);
            e.preventDefault();
          }}
        >
          {currentPage}
        </PaginationLink>
      </PaginationItem>
    );

    // Include the previous page if currentPage is not the first page
    if (currentPage > 1) {
      paginationLinks.unshift(
        <PaginationItem key={currentPage - 1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              handlePaginationClick(e, currentPage - 1);
              e.preventDefault();
            }}
          >
            {currentPage - 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Include the next page if currentPage is not the last page
    if (currentPage < totalPages) {
      paginationLinks.push(
        <PaginationItem key={currentPage + 1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              handlePaginationClick(e, currentPage + 1);
              e.preventDefault();
            }}
          >
            {currentPage + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return paginationLinks;
  };

  function handlePaginationClick(e, i) {
    getHistoryData(`${apiUrl}/api/transaction/read/${userId}?page=${i}`);
  }

  if (loading && !historyData) {
    return <Skeleton className="w-full h-full"></Skeleton>;
  }
  return (
    <Card className="w-full h-full flex flex-col align-stretch justify-stretch">
      <CardHeader className="flex align-start justify-start h-auto">
        <CardTitle className="flex flex-row align-center justify-between mb-[10px]">
          History
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full w-full">
        <ScrollArea className="flex justify-center align-start w-full h-[1050px] ml-0">
          {historyData ? (
            historyData.map((item, index) => (
              <Dialog
                onOpenChange={(open) => setDialogIsOpen(open)}
                className="h-[90%] max-w-[320px] md:max-w-lg lg:max-w-2xl"
                key={index}
              >
                <DialogTrigger
                  className="w-full"
                  onClick={() => setTransactionData(item)}
                >
                  <div className="flex flex-row items-center justify-between  rounded-md hover:bg-accent">
                    <div className="text-sm text-muted-foreground">
                      {index + 1}
                    </div>
                    <div
                      key={item._id}
                      className="flex flex-col w-full mr-[10px]"
                    >
                      <div className="flex flex-row items-center justify-between text-sm text-muted-foreground">
                        {item.date.split("T")[0]}
                        <div className="flex flex-row items-end justify-end text-sm text-muted-foreground">
                          {item.accountTitle}
                        </div>
                      </div>
                      {item.type === "expense" ? (
                        <div className="flex flex-row  items-center justify-between m-[5px] ml-[20px]">
                          <div
                            className="flex flex-row items-start justify-start"
                            style={{ fontSize: "20px", color: red }}
                          >
                            {item.amount}
                          </div>
                          <div className="flex flex-row items-center justify-center mr-[20px]">
                            {item.categoryTitle}
                          </div>
                        </div>
                      ) : item.type === "income" ? (
                        <div className="flex flex-row  items-center justify-between m-[5px] ml-[20px]">
                          <div
                            className="flex flex-row items-start justify-start"
                            style={{ fontSize: "20px", color: green }}
                          >
                            {item.amount}
                          </div>
                          <div className="flex flex-row items-center justify-center mr-[20px]">
                            {item.categoryTitle}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-row  items-center justify-between m-[5px] ml-[20px] mr-0">
                          <div
                            className="flex flex-row items-start justify-start"
                            style={{ fontSize: "20px" }}
                          >
                            {item.amount}
                          </div>
                          <div className="flex flex-row items-center justify-center text-sm text-muted-foreground">
                            -{">"} {item.toAccountTitle}
                          </div>
                        </div>
                      )}
                      {/* <div className="flex justify-end text-sm text-muted-foreground">
                        Balance: 100
                      </div> */}
                      <div
                        className="w-full h-[0px] m-[5px] "
                        style={{
                          borderBottom: "0.5px solid #9494944d",
                          display: "grid",
                          justifySelf: "center",
                        }}
                      ></div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="h-[90%] max-w-[320px] md:max-w-lg lg:max-w-2xl min-h-[610px]">
                  {transactionData ? (
                    <>
                      <Tabs
                        defaultValue={transactionData.accountId}
                        className="h-[80%] w-full max-w-[275px] md:max-w-lg lg:max-w-2xl"
                      >
                        <ScrollArea className="h-[50px] w-full p-1">
                          <TabsList className="flex justify-center items-center">
                            <div className="flex flex-row justify-between items-center">
                              {userData.accounts.length > 0 ? (
                                userData.accounts.map((account, index) => {
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
                                })
                              ) : (
                                <div />
                              )}
                            </div>
                          </TabsList>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </Tabs>
                      <div className="h-full w-full md:m-2 flex flex-col items-center justify-between">
                        <div className="mb-2 md:m-2 flex justify-center items-center">
                          <Input
                            style={{
                              height: "70px",
                              width: "60%",
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
                          ></Input>
                        </div>
                        <div className="block md:hidden">
                          <Popover
                            modal={true}
                            open={popoverOpen}
                            onOpenChange={setPopoverOpen}
                          >
                            <PopoverTrigger className="w-full" asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !transactionData.date &&
                                  "text-muted-foreground"
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={transactionData.date}
                                name="date"
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
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
                                initialFocus
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
                            {/* <div> */}
                            <ScrollArea className="lg:h-[298px] lg:w-[231.36px] md:w-[150px] md:h-[240px] h-[180px] w-full rounded-md border px-2 pt-2 md:px-4 md:pt-4 mr-6">
                              <RadioGroup
                                name="category"
                                defaultValue={transactionData.categoryId}
                              >
                                {transactionData.type === "expense" &&
                                  userData.categories.length > 0 ? (
                                  userData.categories.map((category, index) => {
                                    if (category.categoryType === "expense") {
                                      return (
                                        <div
                                          className="flex flex-row items-center justify-start"
                                          key={index}
                                        >
                                          <RadioGroupItem
                                            style={{
                                              backgroundColor:
                                                category.categoryColor,
                                            }}
                                            className="w-5 h-5 mr-2"
                                            name="category"
                                            value={category._id}
                                            id={index}
                                            onClick={() => {
                                              setTransactionData(
                                                (prevData) => ({
                                                  ...prevData,
                                                  categoryId: category._id,
                                                  toAccountId: "",
                                                  fromAccountId: "",
                                                })
                                              );
                                            }}
                                          ></RadioGroupItem>
                                          <Label
                                            htmlFor={index}
                                            className="bg:text-lg"
                                          >
                                            {category.categoryTitle}
                                          </Label>
                                        </div>
                                      );
                                    }
                                  })
                                ) : transactionData.type === "income" &&
                                  userData.categories.length > 0 ? (
                                  userData.categories.map((category, index) => {
                                    if (category.categoryType === "income") {
                                      return (
                                        <div
                                          className="flex flex-row items-center justify-start"
                                          key={index}
                                        >
                                          <RadioGroupItem
                                            style={{
                                              backgroundColor:
                                                category.categoryColor,
                                            }}
                                            className="w-5 h-5 mr-2"
                                            name="category"
                                            value={category._id}
                                            id={index}
                                            onClick={() => {
                                              setTransactionData(
                                                (prevData) => ({
                                                  ...prevData,
                                                  categoryId: category._id,
                                                  toAccountId: "",
                                                  fromAccountId: "",
                                                })
                                              );
                                            }}
                                          ></RadioGroupItem>
                                          <Label
                                            htmlFor={index}
                                            className="bg:text-lg"
                                          >
                                            {category.categoryTitle}
                                          </Label>
                                          {/* </div> */}
                                        </div>
                                      );
                                    }
                                  })
                                ) : transactionData.type === "transfer" ? (
                                  <>
                                    <div className="mb-2">
                                      Transfer to Account
                                    </div>
                                    {userData.accounts.map((account, index) => {
                                      return (
                                        <div
                                          className="flex flex-row items-center justify-start"
                                          key={index}
                                        >
                                          {account._id ===
                                            transactionData.accountId ? (
                                            <>
                                              <RadioGroupItem
                                                style={{
                                                  backgroundColor:
                                                    account.accountColor,
                                                }}
                                                disabled={true}
                                                className="w-5 h-5 mr-2"
                                                name="account"
                                                value={account._id}
                                                id={index}
                                                onClick={() => {
                                                  setTransactionData(
                                                    (prevData) => ({
                                                      ...prevData,
                                                      toAccountId: account._id,
                                                      fromAccountId: "",
                                                    })
                                                  );
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
                                                  backgroundColor:
                                                    account.accountColor,
                                                }}
                                                className="w-5 h-5 mr-2"
                                                name="account"
                                                value={account._id}
                                                id={index}
                                                onClick={() => {
                                                  setTransactionData(
                                                    (prevData) => ({
                                                      ...prevData,
                                                      toAccountId: account._id,
                                                      fromAccountId: "",
                                                    })
                                                  );
                                                }}
                                              ></RadioGroupItem>
                                              <Label
                                                htmlFor={index}
                                                className="bg:text-lg"
                                              >
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
                                )}
                              </RadioGroup>
                            </ScrollArea>
                            {/* </div> */}
                          </div>
                          <div className="lg:m-2 hidden md:block">
                            <Calendar
                              mode="single"
                              selected={transactionData.date}
                              // onSelect={setDate}
                              name="date"
                              value={transactionData.date}
                              initialFocus
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              onSelect={(date) => {
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
                        <div className="w-full flex justify-between align-center m-2 mt-7">
                          <Dialog className="w-[50%] flex items-end">
                            <DialogTrigger>
                              <Badge
                                className="w-[100px] h-[38px] flex justify-center items-center"
                                variant="outline"
                              >
                                <p style={{ fontSize: "small", margin: "0" }}>
                                  Delete
                                </p>
                              </Badge>
                            </DialogTrigger>
                            <DialogContent className="w-[80%] max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>
                                  Are you sure you want to delete the
                                  transaction?
                                </DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the transaction.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <div className="flex flex-row justify-between">
                                    <Button
                                      className="w-[100px] flex align-end items-end"
                                      variant="outline"
                                    >
                                      cancel
                                    </Button>
                                    <Button
                                      className="w-[100px] flex align-end items-end ml-[10px]"
                                      variant="destructive"
                                      onClick={() => deleteTransaction()}
                                    >
                                      delete
                                    </Button>
                                  </div>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <DialogClose asChild>
                            <Button variant="default" onClick={submitChanges}>
                              Save Changes
                            </Button>
                          </DialogClose>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>Loading ...</div>
                  )}
                </DialogContent>
              </Dialog>
            ))
          ) : (
            <></>
          )}
        </ScrollArea>
        <Pagination className="felx justify-center align-end items-end h-auto mt-[20px] w-11/12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  handlePaginationClick(e, currentPage - 1);
                  e.preventDefault();
                }}
                href="#"
              />
            </PaginationItem>
            {generatePaginationLinks(totalPages)}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  currentPage < totalPages
                    ? handlePaginationClick(e, currentPage + 1)
                    : null;
                  e.preventDefault();
                }}
                href="#"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}
