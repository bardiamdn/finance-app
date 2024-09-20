import { useLayoutEffect, useState, useContext } from "react";
import axios from "axios";
// import { DataContext } from "@/Home";
import { Moon, Sun, Pencil, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ui/theme-provider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const mode = import.meta.env.VITE_MODE;
const apiUrl =
  mode === "production"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV;

export function ProfileDialog() {
  // const { apiUrl, setDialogIsOpen } = useContext(DataContext);
  const { setTheme } = useTheme();
  const [username, setUsername] = useState(null);

  const signOut = () => {
    localStorage.removeItem("FinanceMadaniLabBearerToken");
    localStorage.removeItem("FinanceMadaniLabUserId");
    localStorage.removeItem("FinanceMadaniLabUsername");
    window.location.reload();
    return redirect("/login");
  };
  function getUsername() {
    const username = localStorage.getItem("FinanceMadaniLabUsername");
    setUsername(username);
  }
  useLayoutEffect(() => {
    getUsername();
  }, [username]);

  function deleteAccount() {
    axios.delete(`${apiUrl}/auth/delete-account`);
  }
  // console.log(username);

  return (
    <Dialog
    //  onOpenChange={(open) => setDialogIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <UserRound variant="outline" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hi {username} 👋</DialogTitle>
        </DialogHeader>
        {/* <div className="flex flex-row items-center justify-start">
          <Button variant="ghost" className="justify-center mr-[10px]">
            <Pencil className="h-[15px] w-[15px]" />
          </Button>
          <DialogDescription>
            You can change your password and username limited times.
          </DialogDescription>
        </div> */}
        <div className="p-[20px]">
          <div className="flex flex-row justify-between items-center mt-[15px]">
            <Label>Set Theme</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[150px]">
                  {/* Set Theme */}
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[150px]" align="start">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-row justify-between items-center mt-[25px]">
            <Label>First Day of the Week</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-[150px]" variant="outline"></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[150px]" align="start">
                <DropdownMenuItem>Sunday</DropdownMenuItem>
                <DropdownMenuItem>Monday</DropdownMenuItem>
                <DropdownMenuItem>Tuesday</DropdownMenuItem>
                <DropdownMenuItem>Wednsday</DropdownMenuItem>
                <DropdownMenuItem>Thursday</DropdownMenuItem>
                <DropdownMenuItem>Friday</DropdownMenuItem>
                <DropdownMenuItem>Saturday</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-row justify-between items-center mt-[10px]">
            <Label>First Day of the Month</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-[150px]" variant="outline"></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[150px]" align="start">
                <DropdownMenuItem>First day of month</DropdownMenuItem>
                <ScrollArea className="h-[300px]">
                  {Array.from({ length: 31 }, (_, index) => (
                    <DropdownMenuItem key={index}>{index + 1}</DropdownMenuItem>
                  ))}
                </ScrollArea>
                <DropdownMenuItem>Last day of month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <Label>Selected Currency</Label>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <ScrollArea>Hi</ScrollArea>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center justify-between mt-[50px]">
          <Popover>
            <PopoverTrigger>
              <Button variant="ghost">Delete Account</Button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </p>
              <Input
                className="m-[5px]"
                type="username"
                placeholder="Username"
              />
              <Input
                className="m-[5px]"
                type="password"
                placeholder="Password"
              />
              <Button
                className="mt-[5px] ml-[5px]"
                variant="destructive"
                onClick={deleteAccount}
              >
                Delete Account
              </Button>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
