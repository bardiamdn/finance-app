import { useContext, useState, useEffect } from "react";
import axios from "axios";

// context
import { DataContext } from "@/Home";

//components
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, Cell } from "recharts";
import { PieChart, Pie } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LuPlus } from "react-icons/lu";

// colors
import { colors, myColors } from "@/components/ui/colors";

export default function AccountsAnalyticPie() {
  // context variable
  const { apiUrl, update, config, userData, setUserData, token, userId } =
    useContext(DataContext);

  const [accountData, setAccountData] = useState(null);
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
        const response = await axios.get(
          apiUrl + "/api/balance/timeframe-account-balance/" + userId,
          config
        );
        if (response.status === 200 && userData.accounts.length > 0) {
          const accountsBalance = response.data.accountsBalance.reduce(
            (map, account) => {
              map[account.accountId] = { balance: account.balance };
              return map;
            },
            {}
          );

          const coloredAccountData = userData.accounts.map((account) => {
            const accountBalance = accountsBalance[account._id];
            if (accountBalance) {
              return { ...account, ...accountBalance };
            } else {
              return { ...account, balance: 0 };
            }
          });

          setAccountData(coloredAccountData);
          setLoading(false);
        } else if (response.status === 204) {
          setLoading(true);
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
      if (token && userId && newAccountData.accountTitle.length > 0) {
        await axios
          .put(
            apiUrl + "/api/profile/add-account/" + userId,
            newAccountData,
            config
          )
          .then((response) => {
            // window.location.reload();
            // console.log(response)
            setUserData(response.data.data);
          });
        setNewAccountData({
          accountTitle: "",
          accountColor: colors[0].value,
        });
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
    // setAddClicked(prevState => !prevState)
  }

  async function updateAccount() {
    try {
      if (token && userId && selectedAccount) {
        const index = userData.accounts.findIndex(
          (account) => account._id === selectedAccount._id
        );
        if (index !== -1) {
          userData.accounts[index] = {
            ...userData.accounts[index],
            accountTitle: selectedAccount.accountTitle,
            accountColor: selectedAccount.accountColor,
          };
        } else {
          console.log(
            "Nothing was updated, because account with id: ",
            accountId,
            "was not found."
          );
          return userData;
        }

        await axios
          .put(
            apiUrl + "/api/profile/update-account/" + userId,
            userData,
            config
          )
          .then((response) => {
            setUserData(response.data.data);
          });
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  }

  async function deleteAccount(id) {
    try {
      if (token && userId) {
        await axios
          .delete(
            `${apiUrl}/api/profile/remove-account/${userId}/?accountId=${id}`,
            config
          )
          .then((response) => {
            setUserData(response.data.data);
          });
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return <Skeleton className="w-[641.3px] h-[340px]"></Skeleton>;
  }
  return (
    <Card className="w-full h-full">
      <div className=" flex flex-row justify-between items-center mb-0">
        <CardHeader className="w-[50%] flex items-start">
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <Dialog className="w-[50%] flex items-end">
          <DialogTrigger>
            <Badge
              className="w-[50px] h-[35px] mt-[15px] mr-[30px] justify-center align-center hover:bg-accent"
              variant="ghost"
            >
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
                  <div
                    className={`w-8 h-7 rounded-md mr-2 colorDiv`}
                    style={{ backgroundColor: newAccountData.accountColor }}
                  ></div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div className="flex justify-between items-center">
                      Current Color
                      <div
                        className={`w-8 h-7 rounded-md colorDiv`}
                        style={{
                          backgroundColor: newAccountData.accountColor,
                        }}
                      ></div>
                    </div>
                  </DropdownMenuLabel>
                  <ScrollArea className="h-72 w-[200px] rounded-md border">
                    <div className="grid grid-cols-4 gap-[1px]">
                      {myColors.length > 0 ? (
                        myColors.map((color, index) => (
                          <DropdownMenuItem
                            key={color.value}
                            onClick={() =>
                              setNewAccountData((prevData) => ({
                                ...prevData,
                                accountColor: color.value,
                              }))
                            }
                          >
                            <div className="flex justify-center items-center">
                              <div
                                className="w-8 h-7 rounded-md colorDiv"
                                style={{ backgroundColor: `${color.value}` }}
                              ></div>
                            </div>
                            {index % 4 === 3 && <div className="w-full"></div>}{" "}
                            {/* Add a new row after every four items */}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <div />
                      )}
                    </div>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              <Input
                className="w-50"
                defaultValue={newAccountData.accountTitle}
                placeholder="Category Name"
                onChange={(e) =>
                  setNewAccountData((prevData) => ({
                    ...prevData,
                    accountTitle: e.target.value,
                  }))
                }
              ></Input>
            </div>

            <DialogClose className="flex justify-end">
              <Badge
                className="w-[70px] h-[37px] flex justify-center items-center"
                onClick={() => addNewAccount()}
              >
                <p style={{ fontSize: "small", margin: "0" }}>Save</p>
              </Badge>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
      <CardContent
        style={{ width: "100%", height: "250px" }}
        className="flex flex-row "
      >
        <div style={{ width: "50%", height: "256px" }}>
          <ScrollArea className="h-[90%] w-full overflow-hidden">
            {accountData ? (
              accountData.map((account) => (
                <Dialog key={account._id}>
                  <DialogTrigger
                    onClick={() => {
                      setSelectedAccount(account);
                    }}
                    className="flex w-full py-[10px] px-[5px] rounded-md hover:bg-accent justify-between"
                  >
                    <div className="flex flex-row">
                      <div
                        className="flex w-6 h-6 mr-2 rounded-md colorDiv"
                        style={{
                          backgroundColor: `${account.accountColor}`,
                        }}
                      />
                      <p className="w-[60%] flex justify-start overflow-hidden whitespace-nowrap text-overflow-ellipsis">
                        {account.accountTitle}
                      </p>
                    </div>
                    {account.balance > 0 ? (
                      <p
                        className="w-[40%] overflow-hidden"
                        style={{ color: "#25ff1dbd" }}
                      >
                        {account.balance.toFixed(2)}
                      </p>
                    ) : (
                      <p
                        className="w-[40%] overflow-hidden"
                        style={{ color: "#ff1d1dbd" }}
                      >
                        {account.balance.toFixed(2)}
                      </p>
                    )}
                  </DialogTrigger>
                  {selectedAccount ? (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {selectedAccount.accountTitle}
                        </DialogTitle>
                        <DialogDescription>
                          Make Changes and Save
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col">
                        <div className="flex flex-row justify-center items-center mt-[25px]">
                          <DropdownMenu className="colorDiv">
                            <DropdownMenuTrigger>
                              <div
                                className={`w-8 h-7 rounded-md mr-2 colorDiv`}
                                style={{
                                  backgroundColor: selectedAccount.accountColor,
                                }}
                              ></div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>
                                <div className="flex justify-between items-center">
                                  Current Color
                                  <div
                                    className={`w-8 h-7 rounded-md colorDiv`}
                                    style={{
                                      backgroundColor:
                                        selectedAccount.accountColor,
                                    }}
                                  ></div>
                                </div>
                              </DropdownMenuLabel>
                              <ScrollArea className="h-72 w-[200px] rounded-md border">
                                <div className="grid grid-cols-4 gap-[1px]">
                                  {myColors.length > 0 ? (
                                    myColors.map((color, index) => (
                                      <DropdownMenuItem
                                        key={color.value}
                                        onClick={() =>
                                          setSelectedAccount((prevData) => ({
                                            ...prevData,
                                            accountColor: color.value,
                                          }))
                                        }
                                      >
                                        <div className="flex justify-center items-center">
                                          <div
                                            className="w-8 h-7 rounded-md colorDiv"
                                            style={{
                                              backgroundColor: `${color.value}`,
                                            }}
                                          ></div>
                                        </div>
                                        {index % 4 === 3 && (
                                          <div className="w-full"></div>
                                        )}{" "}
                                        {/* Add a new row after every four items */}
                                      </DropdownMenuItem>
                                    ))
                                  ) : (
                                    <div />
                                  )}
                                </div>
                              </ScrollArea>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Input
                            className="w-50"
                            defaultValue={selectedAccount.accountTitle}
                            placeholder="Account Name"
                            onChange={(e) =>
                              setSelectedAccount((prevData) => ({
                                ...prevData,
                                accountTitle: e.target.value,
                              }))
                            }
                          ></Input>
                        </div>
                        <div className="flex justify-between">
                          <Dialog>
                            <DialogTrigger>
                              <Badge
                                className="w-[70px] h-[37px] flex justify-center items-center"
                                variant="outline"
                              >
                                <p style={{ fontSize: "small", margin: "0" }}>
                                  Delete
                                </p>
                              </Badge>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Delete the {selectedAccount.accountTitle}{" "}
                                  account?
                                </DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone and it will
                                  permanently delete your{" "}
                                  {selectedAccount.accountTitle} Account. Are
                                  you sure?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex flex-row justify-end">
                                <DialogClose>
                                  <Badge
                                    className="w-[100px] h-[37px] flex justify-center items-center"
                                    variant="outline"
                                  >
                                    <p
                                      style={{
                                        fontSize: "small",
                                        margin: "0",
                                      }}
                                    >
                                      Cancel
                                    </p>
                                  </Badge>
                                </DialogClose>
                                <DialogClose>
                                  <Badge
                                    className="ml-[10px] w-[100px] h-[37px] flex justify-center items-center"
                                    variant="destructive"
                                    onClick={() =>
                                      deleteAccount(selectedAccount._id)
                                    }
                                  >
                                    <p
                                      style={{
                                        fontSize: "small",
                                        margin: "0",
                                      }}
                                    >
                                      Delete
                                    </p>
                                  </Badge>
                                </DialogClose>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <DialogClose>
                            <Badge
                              className="w-[70px] h-[37px] flex justify-center items-center"
                              onClick={() => updateAccount()}
                            >
                              <p style={{ fontSize: "small", margin: "0" }}>
                                Save
                              </p>
                            </Badge>
                          </DialogClose>
                        </div>
                      </div>
                    </DialogContent>
                  ) : (
                    <></>
                  )}
                </Dialog>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </ScrollArea>
        </div>
        <div
          className="flex justify-start align-start items-start"
          style={{ width: "50%", height: "256px" }}
        >
          <ResponsiveContainer>
            <PieChart>
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
  );
}
