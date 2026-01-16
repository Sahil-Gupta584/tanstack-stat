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
    <Navbar
      maxWidth="xl"
      className="bg-white/80 dark:bg-black/80 backdrop-blur-xl backdrop-saturate-150 border-b border-[#e8e8ed]/50 dark:border-[#3a3a3c]/50"
      classNames={{
        wrapper: "max-w-6xl px-6",
        item: "data-[active=true]:text-primary",
      }}
      height="4rem"
    >
      <NavbarBrand>
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 font-semibold text-lg text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-80 transition-opacity"
        >
          <Logo />
          <span className="tracking-tight">Insightly</span>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="center" className="hidden sm:flex gap-8">
        <NavbarItem>
          <Link
            to="/#pricing"
            className="text-sm font-medium text-[#6e6e73] dark:text-[#8e8e93] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
          >
            Pricing
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-3">
        <NavbarItem className="hidden sm:flex">
          <ThemeToggle />
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            to={user?.$id ? "/dashboard" : "/auth"}
            radius="full"
            className="bg-[#0071e3] dark:bg-[#0a84ff] text-white font-medium px-5 h-9 text-sm hover:bg-[#0066cc] dark:hover:bg-[#3d9eff] transition-colors shadow-none"
          >
            {user && user.$id ? "Dashboard" : "Get Started"}
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default LandingPageNav;
