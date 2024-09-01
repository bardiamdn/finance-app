import React, { useContext, useState, useReducer, useEffect } from "react";
import axios from "axios";

// context
import { DataContext } from "@/home";

//components
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// icons
import { LuPlusSquare } from "react-icons/lu";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import { FiPlus, FiEdit3, FiEdit2 } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";
import { GoTrash } from "react-icons/go";

// colors
import { colors, myColors } from "@/components/ui/colors";

export function CategoryLegend() {
  // context variable
  const { apiUrl, config, userData, setUserData, token, userId } =
    useContext(DataContext);
  // states
  const [newCategoryData, setNewCategoryData] = useState({
    categoryTitle: "",
    categoryColor: colors[0].value,
    categoryType: "expense",
  });

  const [categoryData, setCategoryData] = useState(null);
  // loading userData
  const [loading, setLoading] = useState(true);

  // effect for loading the useData
  useEffect(() => {
    setLoading(true);

    if (userData.accounts.length > 0) {
      setLoading(false);
    }
  }, [userData]);

  async function addCategory() {
    if (userId && newCategoryData.categoryTitle) {
      try {
        await axios
          .put(
            apiUrl + "/api/profile/add-category/" + userId,
            newCategoryData,
            config
          )
          .then((response) => {
            setUserData(response.data.data);
            // console.log(response)
          });
      } catch (error) {
        console.error("Error posting data:", error);
      }
    } else {
      console.log("insert category name");
    }
    setNewCategoryData({
      categoryTitle: "",
      categoryColor: colors[0].value,
      categoryType: "expense",
    });
    // setAddNewCategoryClicked(prevState => !prevState)
  }
  async function updateCategory() {
    if (userId && categoryData._id) {
      try {
        await axios
          .put(
            apiUrl + "/api/profile/update-category/" + userId,
            categoryData,
            config
          )
          .then((response) => {
            setUserData(response.data.data);
            // console.log(response)
          });
      } catch (error) {
        console.error(error);
      }
      // setUpdateCategoryClicked(false);
      // setUpdatedCategoryData(null);
    } else {
      console.log("error updating the category");
    }
  }

  async function deleteCategory() {
    try {
      // console.log("categoryData", categoryData)
      const result = await axios.delete(
        apiUrl +
          "/api/profile/remove-category/" +
          userId +
          "/" +
          categoryData._id,
        config
      );
      setUserData(result.data.data);
      // console.log("from delete category", result);
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return <Skeleton className="w-[641.3] h-[340px]"></Skeleton>;
  }
  return (
    <div>
      <Card className="w-[641.3] h-[340px]">
        <div className=" flex flex-row justify-between items-center">
          <CardHeader className="w-[50%] flex items-start">
            <CardTitle>Categoies</CardTitle>
          </CardHeader>
          {/* <Button className="w-[50px] h-[35px] mt-[15px] mr-[30px]" variant="ghost" onClick={openDialog}>
						<LuPlus className="h-4 w-4"></LuPlus>
					</Button> */}
          <Dialog className="w-[50%] flex items-end">
            <DialogTrigger>
              {/* <Button className="w-[50px] h-[35px] mt-[15px] mr-[30px]" variant="ghost">
							</Button> */}
              <Badge
                className="w-[50px] h-[35px] mt-[15px] mr-[30px] justify-center align-center hover:bg-accent"
                variant="ghost"
              >
                <LuPlus className="h-4 w-4"></LuPlus>
              </Badge>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              {newCategoryData ? (
                <>
                  <RadioGroup
                    name="type"
                    defaultValue={newCategoryData.categoryType}
                    className="flex flex-row align-center justify-center items-center mt-[25px]"
                  >
                    <div className="flex items-center space-x-2 mr-10">
                      <RadioGroupItem
                        name="type"
                        value="expense"
                        id="expense"
                        onClick={() =>
                          setNewCategoryData((prevData) => ({
                            ...prevData,
                            categoryType: "expense",
                          }))
                        }
                      />
                      <Label htmlFor="expense">Expense</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        name="type"
                        value="income"
                        id="income"
                        onClick={() =>
                          setNewCategoryData((prevData) => ({
                            ...prevData,
                            categoryType: "income",
                          }))
                        }
                      />
                      <Label htmlFor="income">Income</Label>
                    </div>
                  </RadioGroup>
                  <div className="flex flex-row justify-center items-center mt-[25px]">
                    <DropdownMenu className="colorDiv">
                      <DropdownMenuTrigger>
                        <div
                          className={`w-8 h-7 rounded-md mr-2 colorDiv`}
                          style={{
                            backgroundColor: newCategoryData.categoryColor,
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
                                backgroundColor: newCategoryData.categoryColor,
                              }}
                            ></div>
                            {/* <div className={`w-8 h-7 rounded-md mr-2 colorDiv`} style={{backgroundColor: `${item.accountColor}`}}></div> */}
                          </div>
                        </DropdownMenuLabel>
                        {/* <DropdownMenuSeparator /> */}
                        <ScrollArea className="h-72 w-[200px] rounded-md border">
                          <div className="grid grid-cols-4 gap-[1px]">
                            {myColors.length > 0 ? (
                              myColors.map((color, index) => (
                                <DropdownMenuItem
                                  key={color.value}
                                  onClick={() =>
                                    setNewCategoryData((prevData) => ({
                                      ...prevData,
                                      categoryColor: color.value,
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

                    {/* <div className={`w-8 h-7 rounded-md mr-2 colorDiv`} style={{ backgroundColor: `${colors[0].value}` }}></div> */}
                    <Input
                      className="w-50"
                      defaultValue={newCategoryData.categoryTitle}
                      placeholder="Category Name"
                      onChange={(e) =>
                        setNewCategoryData((prevData) => ({
                          ...prevData,
                          categoryTitle: e.target.value,
                        }))
                      }
                    ></Input>
                  </div>
                  <DialogClose className="flex justify-end">
                    <Badge
                      className="w-[70px] h-[37px] flex justify-center items-center"
                      onClick={() => addCategory()}
                    >
                      <p style={{ fontSize: "small", margin: "0" }}>Save</p>
                    </Badge>
                  </DialogClose>
                </>
              ) : (
                <></>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <CardContent className="flex flex-row h-[100%] w-[100%]">
          <div className="flex flex-col justify-start items-start ml-[25px]">
            <div className="flex flex-row align-center justify-center items-center mb-4">
              <div
                className="w-[70px] h-[0px]"
                style={{ borderBottom: "0.5px solid #9494944d" }}
              ></div>
              <div>
                <p className="mr-2 ml-2 text-sm text-muted-foreground">
                  Expense
                </p>
              </div>
              <div
                className="w-[70px] h-[0px]"
                style={{ borderBottom: "0.5px solid #9494944d" }}
              ></div>
            </div>
            <ScrollArea className="h-[210px] w-[260px]">
              <Dialog>
                <div className="flex flex-col">
                  {userData.categories.length > 0 ? (
                    userData.categories.map((category, index) => {
                      if (category.categoryType === "expense") {
                        return (
                          <DialogTrigger
                            key={index}
                            className="w-[260px] rounded-md hover:bg-accent"
                            // style={{border: "1px solid #ffff"}}
                          >
                            <div
                              className="flex flex-row align-center items-center pb-2 pt-2"
                              // style={{border: "1px solid #fff"}}
                              onClick={() => {
                                setCategoryData(category);
                              }}
                            >
                              <div
                                className={`w-5 h-5 rounded-md mr-2 colorDiv`}
                                style={{
                                  backgroundColor: `${category.categoryColor}`,
                                }}
                              ></div>
                              {category.categoryTitle}
                            </div>
                          </DialogTrigger>
                        );
                      }
                    })
                  ) : (
                    <div />
                  )}
                </div>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Click Save to Apply Changes</DialogTitle>
                  </DialogHeader>
                  {categoryData ? (
                    <>
                      <RadioGroup
                        name="type"
                        defaultValue={categoryData.categoryType}
                        className="flex flex-row align-center justify-center items-center mt-[25px]"
                      >
                        <div className="flex items-center space-x-2 mr-10">
                          <RadioGroupItem
                            name="type"
                            value="expense"
                            id="expense"
                            onClick={() =>
                              setCategoryData((prevData) => ({
                                ...prevData,
                                categoryType: "expense",
                              }))
                            }
                          />
                          <Label htmlFor="expense">Expense</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            name="type"
                            value="income"
                            id="income"
                            onClick={() =>
                              setCategoryData((prevData) => ({
                                ...prevData,
                                categoryType: "income",
                              }))
                            }
                          />
                          <Label htmlFor="income">Income</Label>
                        </div>
                      </RadioGroup>
                      <div className="flex flex-row justify-center items-center mt-[25px]">
                        <DropdownMenu className="colorDiv">
                          <DropdownMenuTrigger>
                            <div
                              className={`w-8 h-7 rounded-md mr-2 colorDiv`}
                              style={{
                                backgroundColor: categoryData.categoryColor,
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
                                    backgroundColor: categoryData.categoryColor,
                                  }}
                                ></div>
                                {/* <div className={`w-8 h-7 rounded-md mr-2 colorDiv`} style={{backgroundColor: `${item.accountColor}`}}></div> */}
                              </div>
                            </DropdownMenuLabel>
                            {/* <DropdownMenuSeparator /> */}
                            <ScrollArea className="h-72 w-[200px] rounded-md border">
                              <div className="grid grid-cols-4 gap-[1px]">
                                {myColors.length > 0 ? (
                                  myColors.map((color, index) => (
                                    <DropdownMenuItem
                                      key={color.value}
                                      onClick={() =>
                                        setCategoryData((prevData) => ({
                                          ...prevData,
                                          categoryColor: color.value,
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

                        {/* <div className={`w-8 h-7 rounded-md mr-2 colorDiv`} style={{ backgroundColor: `${colors[0].value}` }}></div> */}
                        <Input
                          className="w-50"
                          defaultValue={categoryData.categoryTitle}
                          placeholder="Category Name"
                          onChange={(e) =>
                            setCategoryData((prevData) => ({
                              ...prevData,
                              categoryTitle: e.target.value,
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
                            {/* <Button variant="outline" >Delete</Button> */}
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Delete the {categoryData.categoryTitle}{" "}
                                category, and it's transactions?
                              </DialogTitle>
                              <DialogDescription>
                                This action cannot be undone and it will
                                permanently delete your{" "}
                                {categoryData.categoryTitle} category and all
                                related transactions. Are you sure?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-row justify-end">
                              <DialogClose>
                                <Badge
                                  className="w-[100px] h-[37px] flex justify-center items-center"
                                  variant="outline"
                                >
                                  <p style={{ fontSize: "small", margin: "0" }}>
                                    Cancel
                                  </p>
                                </Badge>
                                {/* <Button variant="outline" className=" w-[100px]">Cancel</Button> */}
                              </DialogClose>
                              <DialogClose>
                                <Badge
                                  className="ml-[10px] w-[100px] h-[37px] flex justify-center items-center"
                                  variant="destructive"
                                  onClick={() => deleteCategory()}
                                >
                                  <p style={{ fontSize: "small", margin: "0" }}>
                                    Delete
                                  </p>
                                </Badge>
                                {/* <Button variant="destructive" className="ml-[10px] w-[100px]" onClick={() => deleteCategory()}>Delete</Button> */}
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <DialogClose>
                          <Badge
                            className="w-[70px] h-[37px] flex justify-center items-center"
                            onClick={() => updateCategory(categoryData)}
                          >
                            <p style={{ fontSize: "small", margin: "0" }}>
                              Save
                            </p>
                          </Badge>
                          {/* <Button onClick={() => updateCategory(categoryData)}>Save</Button> */}
                        </DialogClose>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </DialogContent>
              </Dialog>
            </ScrollArea>
          </div>
          <div className="flex flex-col justify-start items-start ml-[30px]">
            <div className="flex flex-row align-center justify-center items-center mb-4">
              <div
                className="w-[70px] h-[0px]"
                style={{ borderBottom: "0.5px solid #9494944d" }}
              ></div>
              <div>
                <p className="mr-2 ml-2 text-sm text-muted-foreground">
                  Income
                </p>
              </div>
              <div
                className="w-[70px] h-[0px]"
                style={{ borderBottom: "0.5px solid #9494944d" }}
              ></div>
            </div>
            <ScrollArea className="h-[210px] w-[260px]">
              <Dialog>
                <div className="flex flex-col">
                  {userData.categories.length > 0 ? (
                    userData.categories.map((category, index) => {
                      if (category.categoryType === "income") {
                        return (
                          <DialogTrigger
                            key={index}
                            className="w-[260px] rounded-md hover:bg-accent"
                            // style={{border: "1px solid #ffff"}}
                          >
                            <div
                              className="flex flex-row align-center items-center pb-2 pt-2"
                              onClick={() => {
                                setCategoryData(category);
                              }}
                            >
                              <div
                                className={`w-5 h-5 rounded-md mr-2 colorDiv`}
                                style={{
                                  backgroundColor: `${category.categoryColor}`,
                                }}
                              ></div>
                              {category.categoryTitle}
                            </div>
                          </DialogTrigger>
                        );
                      }
                    })
                  ) : (
                    <div />
                  )}
                </div>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Click Save to Apply Changes</DialogTitle>
                  </DialogHeader>
                  {categoryData ? (
                    <>
                      <RadioGroup
                        name="type"
                        defaultValue={categoryData.categoryType}
                        className="flex flex-row align-center justify-center items-center mt-[25px]"
                      >
                        <div className="flex items-center space-x-2 mr-10">
                          <RadioGroupItem
                            name="type"
                            value="expense"
                            id="expense"
                            onClick={() =>
                              setCategoryData((prevData) => ({
                                ...prevData,
                                categoryType: "expense",
                              }))
                            }
                          />
                          <Label htmlFor="expense">Expense</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            name="type"
                            value="income"
                            id="income"
                            onClick={() =>
                              setCategoryData((prevData) => ({
                                ...prevData,
                                categoryType: "income",
                              }))
                            }
                          />
                          <Label htmlFor="income">Income</Label>
                        </div>
                      </RadioGroup>
                      <div className="flex flex-row justify-center items-center mt-[25px]">
                        <DropdownMenu className="colorDiv">
                          <DropdownMenuTrigger>
                            <div
                              className={`w-8 h-7 rounded-md mr-2 colorDiv`}
                              style={{
                                backgroundColor: categoryData.categoryColor,
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
                                    backgroundColor: categoryData.categoryColor,
                                  }}
                                ></div>
                                {/* <div className={`w-8 h-7 rounded-md mr-2 colorDiv`} style={{backgroundColor: `${item.accountColor}`}}></div> */}
                              </div>
                            </DropdownMenuLabel>
                            {/* <DropdownMenuSeparator /> */}
                            <ScrollArea className="h-72 w-[200px] rounded-md border">
                              <div className="grid grid-cols-4 gap-[1px]">
                                {myColors.length > 0 ? (
                                  myColors.map((color, index) => (
                                    <DropdownMenuItem
                                      key={color.value}
                                      onClick={() =>
                                        setCategoryData((prevData) => ({
                                          ...prevData,
                                          categoryColor: color.value,
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

                        {/* <div className={`w-8 h-7 rounded-md mr-2 colorDiv`} style={{ backgroundColor: `${colors[0].value}` }}></div> */}
                        <Input
                          className="w-50"
                          defaultValue={categoryData.categoryTitle}
                          placeholder="Category Name"
                          onChange={(e) =>
                            setCategoryData((prevData) => ({
                              ...prevData,
                              categoryTitle: e.target.value,
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
                            {/* <Button variant="outline" >Delete</Button> */}
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Delete the {categoryData.categoryTitle}{" "}
                                category?
                              </DialogTitle>
                              <DialogDescription>
                                This action cannot be undone and it will
                                permanently delete your{" "}
                                {categoryData.categoryTitle} category. Are you
                                sure?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-row justify-end">
                              <DialogClose>
                                <Badge
                                  className="w-[100px] h-[37px] flex justify-center items-center"
                                  variant="outline"
                                >
                                  <p style={{ fontSize: "small", margin: "0" }}>
                                    Cancel
                                  </p>
                                </Badge>
                                {/* <Button variant="outline" className=" w-[100px]">Cancel</Button> */}
                              </DialogClose>
                              <DialogClose>
                                <Badge
                                  className="ml-[10px] w-[100px] h-[37px] flex justify-center items-center"
                                  variant="destructive"
                                  onClick={() => deleteCategory()}
                                >
                                  <p style={{ fontSize: "small", margin: "0" }}>
                                    Delete
                                  </p>
                                </Badge>
                                {/* <Button variant="destructive" className="ml-[10px] w-[100px]" onClick={() => deleteCategory()}>Delete</Button> */}
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <DialogClose>
                          <Badge
                            className="w-[70px] h-[37px] flex justify-center items-center"
                            onClick={() => updateCategory(categoryData)}
                          >
                            <p style={{ fontSize: "small", margin: "0" }}>
                              Save
                            </p>
                          </Badge>
                          {/* <Button onClick={() => updateCategory(categoryData)}>Save</Button> */}
                        </DialogClose>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </DialogContent>
              </Dialog>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
