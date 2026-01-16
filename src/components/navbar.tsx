import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { useTheme } from "next-themes";
import React from "react";

import Logo from "./logo";

import { account } from "@/configs/appwrite/clientConfig";
import { type TClassName } from "@/lib/types";
import { useUser } from "@/lib/userContext";
import { Link, useRouter } from "@tanstack/react-router";

export function Nav({
  brandChild,
  endContent,
}: {
  endContent?: React.ReactNode;
  brandChild?: React.ReactNode;
  className?: TClassName;
}) {
  const { user } = useUser();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <Navbar
      maxWidth="full"
      className="bg-transparent"
      classNames={{
        wrapper: "px-0",
      }}
      height="4rem"
    >
      {/* Brand */}
      <NavbarBrand>
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 font-semibold text-lg text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-80 transition-opacity"
        >
          <Logo />
          <span className="tracking-tight">Insightly</span>
        </Link>
        {brandChild}
      </NavbarBrand>

      {/* Right side user menu */}
      <NavbarContent justify="end">
        <NavbarItem>
          {endContent ? (
            endContent
          ) : (
            <Dropdown
              classNames={{
                content:
                  "min-w-[240px] bg-white dark:bg-[#1c1c1e] border border-[#e8e8ed] dark:border-[#3a3a3c] shadow-apple-lg rounded-2xl p-2",
              }}
            >
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="h-10 px-2 gap-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
                >
                  <Avatar
                    src={user?.image}
                    name={user?.name?.charAt(0) || "U"}
                    size="sm"
                    className="w-8 h-8"
                    classNames={{
                      base: "bg-[#0071e3] dark:bg-[#0a84ff]",
                      name: "text-white font-medium text-sm",
                    }}
                  />
                  <span className="hidden sm:block text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {user?.name || "Account"}
                  </span>
                  <svg
                    className="w-4 h-4 text-[#86868b] dark:text-[#636366]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User menu"
                disabledKeys={["profile"]}
                classNames={{
                  list: "gap-1",
                }}
              >
                {/* Profile Section */}
                <DropdownSection showDivider aria-label="Profile & Actions">
                  <DropdownItem
                    key="profile"
                    isReadOnly
                    className="h-auto py-3 opacity-100 cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user?.image}
                        name={user?.name?.charAt(0) || "U"}
                        size="md"
                        classNames={{
                          base: "bg-[#0071e3] dark:bg-[#0a84ff]",
                          name: "text-white font-medium",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-[#6e6e73] dark:text-[#8e8e93] truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="settings"
                    className="py-2.5 rounded-lg text-[#1d1d1f] dark:text-[#f5f5f7] data-[hover=true]:bg-[#f5f5f7] dark:data-[hover=true]:bg-[#2c2c2e]"
                    startContent={
                      <svg
                        className="w-4 h-4 text-[#6e6e73] dark:text-[#8e8e93]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    }
                  >
                    Settings
                  </DropdownItem>
                  <DropdownItem
                    key="billing"
                    className="py-2.5 rounded-lg text-[#1d1d1f] dark:text-[#f5f5f7] data-[hover=true]:bg-[#f5f5f7] dark:data-[hover=true]:bg-[#2c2c2e]"
                    startContent={
                      <svg
                        className="w-4 h-4 text-[#6e6e73] dark:text-[#8e8e93]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    }
                  >
                    Billing
                  </DropdownItem>
                </DropdownSection>

                {/* Preferences Section */}
                <DropdownSection aria-label="Preferences">
                  <DropdownItem
                    key="theme"
                    isReadOnly
                    className="py-2.5 rounded-lg cursor-default"
                    startContent={
                      <svg
                        className="w-4 h-4 text-[#6e6e73] dark:text-[#8e8e93]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    }
                    endContent={
                      <select
                        className="text-xs font-medium px-2 py-1 rounded-lg border-0 bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] dark:focus:ring-[#0a84ff] cursor-pointer"
                        id="theme"
                        name="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    }
                  >
                    <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">
                      Theme
                    </span>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    className="py-2.5 rounded-lg text-[#ff3b30] data-[hover=true]:bg-[#ff3b30]/10"
                    startContent={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    }
                    onPress={() => {
                      account.deleteSessions().then(() =>
                        router.navigate({
                          to: "/auth",
                          search: { redirect: "/dashboard" },
                        })
                      );
                    }}
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
