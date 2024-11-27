"use client"
import { Database, MonitorCheck, ShieldCheck, Settings, CircleUser, Building2 } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserButton } from "@/components/auth/user-button";
import { useCurrentUser } from "@/hooks/use-current-user";

// Menu items.
const items = [
    {
        title: "Server",
        url: "/server",
        icon: Database,
    },
    {
        title: "Client",
        url: "/client",
        icon: MonitorCheck,
    },
    {
        title: "Admin",
        url: "/admin",
        icon: ShieldCheck,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
    {
        title: "Tenants",
        url: "/tenants",
        icon: CircleUser,
    },
    {
        title: "Create Organization",
        url: "/createorg",
        icon: Building2,
    },
]

export function AppSidebar() {
    const user = useCurrentUser();
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="bg-[#f1f1f1] flex items-center pb-1">
                <UserButton />
                <SidebarGroupLabel><p className="ps-2 text-sm font-semibold">{user ? `${user.name}` : "User"}</p></SidebarGroupLabel>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
