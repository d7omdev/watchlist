import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Mail, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import type { User as UserType } from "@/types/entry";
import { getImageUrl } from "@/lib/utils";

interface HeaderProps {
  onAddClick: () => void;
  onProfileClick: () => void;
  onLogout?: () => void;
}

export function Header({ onAddClick, onProfileClick, onLogout }: HeaderProps) {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    window.location.reload();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Favorite Movies & TV Shows</h1>
        <p className="text-muted-foreground mt-2">
          Manage your collection of favorite movies and TV shows
        </p>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <Button onClick={onAddClick}>Add New Entry</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar
              src={getImageUrl(user?.avatarUrl)}
              className="cursor-pointer hover:scale-105 transition-transform"
              fallback={user ? getInitials(user.name) : "U"}
              size={40}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "User"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onProfileClick}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

