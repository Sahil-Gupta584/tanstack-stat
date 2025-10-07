"use client";

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";

import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/themeToggle";
import type { User } from "@/lib/types";
import { Link } from "@tanstack/react-router";

function LandingPageNav({ user }: { user: User | null }) {
  return (
    <Navbar className="bg-white dark:bg-[#19191C] border-b border-b-neutral-200 dark:border-b-neutral-800">
      <NavbarBrand>
        <Link
          to="/dashboard"
          className="flex gap-2 font-bold text-neutral-900 dark:  text-lg leading-normal"
        >
          <Logo />
          Insightly
        </Link>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem
          className="hover:underline cursor-pointer"
          as={Link}
          href="/#pricing"
        >
          Pricing
        </NavbarItem>
        {/* <NavbarItem
          className="hover:underline cursor-pointer"
          as={Link}
          href="/#faq"
        >
          FAQ
        </NavbarItem> */}
        {/* <NavbarItem as={Link} href='/#pricing'>Reviews</NavbarItem> */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>
        <NavbarItem>
          <Button
            color="primary"
            variant="bordered"
            as={Link}
            href={user && user.$id ? "/dashboard" : "/auth"}
          >
            {user && user.$id ? "Dashboard" : "Log in"}
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default LandingPageNav;
