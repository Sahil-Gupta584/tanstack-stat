import {
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
  User,
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
      shouldHideOnScroll
      classNames={{ wrapper: "max-w-6xl mx-auto px-4" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 dark:bg-[#131315]/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
    >
      {/* Brand */}
      <NavbarBrand>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-lg text-ink dark:text-white"
        >
          <Logo className="h-5" />
          <span>Insightly</span>
        </Link>
        {brandChild}
      </NavbarBrand>

      {/* Right side user menu */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {endContent ? (
            endContent
          ) : (
            <Dropdown showArrow>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="border-gray-200/80 dark:border-gray-800/80 text-ink dark:text-white font-medium rounded-xl hover:border-cipher-red hover:text-cipher-red transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <User
                    avatarProps={{
                      src: user?.image,
                      className: "size-6",
                    }}
                    name={user?.name || "User"}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User menu"
                className="p-2"
                disabledKeys={["profile"]}
              >
                {/* Profile Section */}
                <DropdownSection showDivider aria-label="Profile & Actions">
                  <DropdownItem
                    key="profile"
                    isReadOnly
                    className="h-14 gap-2 opacity-100"
                  >
                    <User
                      avatarProps={{
                        className: "hidden",
                      }}
                      classNames={{
                        name: "",
                        description: "text-neutral-400",
                      }}
                      description={user?.email}
                      name={user?.name}
                    />
                  </DropdownItem>
                  <DropdownItem key="settings">⚙️ Settings</DropdownItem>
                  <DropdownItem key="billing">💳 Billing</DropdownItem>
                </DropdownSection>

                {/* Preferences Section */}
                <DropdownSection aria-label="Preferences">
                  <DropdownItem
                    key="theme"
                    isReadOnly
                    className="cursor-default"
                    endContent={
                      <select
                        className="z-10 w-20 rounded-md text-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#19191C] text-neutral-600 dark:text-neutral-400 hover:border-pink-500 transition"
                        id="theme"
                        name="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="system">System</option>
                      </select>
                    }
                  >
                    🎨 Theme
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    className="text-pink-500"
                    onPress={() => {
                      account.deleteSessions().then(() =>
                        router.navigate({
                          to: "/auth",
                          search: { redirect: "/dashboard" },
                        })
                      );
                    }}
                  >
                    🚪 Log Out
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
