"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  ChartColumnBig,
  LogOut,
  Settings,
  SquarePen,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Searchbar from "./Searchbar";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Navbar = () => {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);
  useEffect(() => {
    const userSetup = async () => {
      if (currentUser === undefined) {
        // Wait until the query resolves
        return;
      }

      if (isSignedIn && user) {
        // If signed in and user exists
        if (currentUser) {
          // User data exists, no need to redirect
          return;
        } else {
          // If no user data exists, redirect to profile setup
          router.push("/profile/setup");
        }
      }
    };

    userSetup();
  }, [isSignedIn, user, currentUser]); // Add currentUser to the dependency array

  return (
    <div className="flex justify-between items-center max-w-[1400px] mx-auto px-3 md:px-6 py-4 md:py-6 border-b shadow-sm">
      <div className="flex items-center space-x-3 w-full">
        <Link href="/">
          <label className="font-semibold hidden md:inline-block text-xl">
            TechBlog
          </label>
          <label className="md:hidden font-semibold">
            <span className="text-[#6C40FE]">T</span>B
          </label>
        </Link>
        <div className="w-full pr-5 md:pr-10">
          <Searchbar />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {currentUser ? (
          <div className="hidden md:flex space-x-4 w-full text-gray-800">
            <Link href="/dashboard">
              <p className="hidden md:inline-block hover:underline ml-3">
                Dashboard
              </p>
            </Link>
            <Link href={`/profile/${currentUser?._id}`}>
              <p className="hidden md:inline-block hover:underline">Profile</p>
            </Link>
            <SignOutButton>
              <p className="hidden md:inline-block hover:underline text-nowrap cursor-pointer">
                Log out
              </p>
            </SignOutButton>
          </div>
        ) : (
          <></>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger>
            {currentUser ? (
              <Settings className="stroke-[1.5] md:hidden h-5 w-5" />
            ) : (
              <></>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="text-gray-900 bg-[#FCFCFE]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard">
              <DropdownMenuItem>
                <ChartColumnBig className="mr-2 h-4 w-4" /> {/* Icon */}
                <span>Dashboard</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/profile">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" /> {/* Icon */}
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" /> {/* Icon */}
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {user ? (
          <Link href="/write">
            <Button className="rounded-full hidden md:flex">
              Write <SquarePen className="ml-2 stroke-[1.5] w-5 h-5" />
            </Button>
            <SquarePen className="ml-1 stroke-[1.5] md:hidden h-5 w-5" />
          </Link>
        ) : (
          <SignInButton>
            <Button className="rounded-full flex">
              Sign in to write{" "}
              <SquarePen className="ml-2 stroke-[1.5] w-5 h-5" />
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

export default Navbar;
