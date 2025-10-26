"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "@/lib/auth-client"
import {
  IconDashboard,
  IconFileDescription,
  IconFileText,
  IconChartBar,
  IconSchool,
  IconBriefcase,
  IconHelp,
  IconSettings,
  IconUser,
  IconListCheck,
  IconHistory
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  
  const userData = session?.user ? {
    name: session.user.name || "User",
    email: session.user.email,
    avatar: session.user.image || "/logo.png",
  } : {
    name: "Guest",
    email: "guest@example.com", 
    avatar: "/logo.png",
  }

  // Navigation items with functional links
  const navMain = [
    {
      title: "Dasbor",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Riwayat Tes",
      url: "/test-history",
      icon: IconHistory,
    },
    {
      title: "Jurusan",
      url: "/majors",
      icon: IconSchool,
    },
    {
      title: "Karir",
      url: "/careers",
      icon: IconBriefcase,
    },
    {
      title: "Rekomendasi",
      url: "/recommendations",
      icon: IconFileDescription,
    },
  ];

  const navSecondary = [
    {
      title: "Pengaturan",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Bantuan",
      url: "/help",
      icon: IconHelp,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                {/* Logo container with text */}
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="relative w-[100px] sm:w-[30px] h-[40px] sm:h-[50px]">
                    <Image
                      src="/logo-cc.png"
                      alt="CareerConnect"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="hidden sm:block text-xl md:text-2xl font-bold">
                    <span className="text-purple-600 underline">Career</span>
                    <span className="text-blue-600 underline">Connect</span>
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
