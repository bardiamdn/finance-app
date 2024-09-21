import { useLayoutEffect, useState, useContext } from "react";
import axios from "axios";
import { redirect } from "react-router-dom";
import { ProfileDataContext } from "../ProfileDataProvider";
import { Moon, Sun, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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

const currencyOptions = [
  { code: "USD", symbol: "$", name: "United States Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
];

export function ProfileDialog() {
  const {
    setDialogIsOpen,
    token,
    userId,
    config,
    setUserData,
    currency,
    setCurrency,
  } = useContext(ProfileDataContext);
  const { setTheme } = useTheme();
  const [username, setUsername] = useState(null);
  const [deleteData, setDeleteData] = useState({
    username: "",
    password: "",
  });
  const [popoverOpen, setPopoverOpen] = useState(false);

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
    axios
      .delete(`${apiUrl}/auth/delete-account`, config)
      .then(() => {
        signOut();
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
      });
  }

  async function updateCurrency(newCurrency) {
    try {
      if (token && userId) {
        setCurrency(newCurrency);

        const response = await axios.put(
          `${apiUrl}/api/profile/update-currency/${userId}`,
          {
            updatedCurrency: newCurrency,
          },
          config
        );
        setUserData(response.data.data);
        setCurrency(response.data.data.currency);
      }

      setCurrency(newCurrency);
    } catch (error) {
      console.error("Error updating currency:", error);
    }
  }

  return (
    <Dialog onOpenChange={(open) => setDialogIsOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <UserRound variant="outline" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80%] max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hi {username} 👋</DialogTitle>
        </DialogHeader>
        <div className="sm:p-[20px]">
          <div className="flex flex-row justify-between items-center mt-[15px]">
            <Label>Set Theme</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[150px]">
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
          <div className="flex flex-row justify-between items-center mt-[10px]">
            <Label>Currency</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-[150px]" variant="outline">
                  {currency}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[150px]" align="start">
                <ScrollArea className="h-[250px]">
                  {currencyOptions.map((item) => (
                    <DropdownMenuItem
                      key={item.code}
                      onClick={() => updateCurrency(item.code)}
                    >
                      {item.code} - {item.symbol}
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center justify-between mt-[50px]">
          <Popover
            modal={true}
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button variant="ghost">Delete Account</Button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  deleteAccount();
                }}
              >
                <Input
                  className="m-[5px]"
                  type="text"
                  placeholder="Username"
                  value={deleteData.username}
                  onChange={(e) =>
                    setDeleteData((data) => ({
                      ...data,
                      username: e.target.value,
                    }))
                  }
                  aria-label="Username"
                  disabled // disabled to avoid accedential deletion
                />
                <Input
                  className="m-[5px]"
                  type="password"
                  placeholder="Password"
                  value={deleteData.password}
                  onChange={(e) =>
                    setDeleteData((data) => ({
                      ...data,
                      password: e.target.value,
                    }))
                  }
                  aria-label="Password"
                  disabled // disabled to avoid accedential deletion
                />
                <Button
                  className="mt-[5px] ml-[5px]"
                  variant="destructive"
                  type="submit"
                  disabled // disabled to avoid accedential deletion
                >
                  Delete Account
                </Button>
              </form>
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
