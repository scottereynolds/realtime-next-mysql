"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import BaseBox from "@/components/MUI/Layout/BaseBox";
import { BaseList } from "@/components/MUI/DataDisplay/BaseList";
import { BaseListItemButton } from "@/components/MUI/DataDisplay/BaseListItemButton";
import { BaseListItemIcon } from "@/components/MUI/DataDisplay/BaseListItemIcon";
import { BaseListItemText } from "@/components/MUI/DataDisplay/BaseListItemText";

import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";

type NavItem = {
  label: string;
  icon: typeof HomeIcon;
  href: string;
};

export function LayoutSidebar({ open }: { open: boolean }) {
  const width = open ? 240 : 64;
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "administrator";

  // Base navigation for all users
  const baseNavItems: NavItem[] = [
    { label: "Home", icon: HomeIcon, href: "/" },
    // No /messages here anymore – users get chat via the header icon
  ];

  // Admin submenu items (only visible if isAdmin)
  const adminNavItems: NavItem[] = [
    {
      label: "Users",
      icon: PeopleIcon,
      href: "/admin/users",
    },
    {
      label: "Messages",
      icon: ChatIcon,
      href: "/admin/messages",
    },
  ];

  return (
    <BaseBox
      component="aside"
      sx={{
        width,
        transition: "width 0.2s ease",
        borderRight: "1px solid rgb(var(--border))",
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Primary nav */}
      <BaseList sx={{ paddingY: 1 }}>
        {baseNavItems.map(({ label, icon: Icon, href }) => {
          const selected = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <BaseListItemButton
                selected={selected}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "rgb(var(--muted))",
                    color: "rgb(var(--foreground))",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "rgb(var(--muted))",
                  },
                }}
              >
                <BaseListItemIcon>
                  <Icon fontSize="small" />
                </BaseListItemIcon>
                {open && <BaseListItemText primary={label} />}
              </BaseListItemButton>
            </Link>
          );
        })}
      </BaseList>

      {/* Admin section */}
      {isAdmin && (
        <BaseList
          sx={{
            paddingY: 1,
            marginTop: 1,
            borderTop: "1px solid rgba(148, 163, 184, 0.4)", // subtle divider
          }}
        >
          {/* Admin section header (not a link) */}
          <BaseListItemButton
            disableRipple
            sx={{
              cursor: "default",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <BaseListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </BaseListItemIcon>
            {open && (
              <BaseListItemText
                primary="Admin"
                primaryTypographyProps={{
                  fontSize: 12,
                  fontWeight: 600,
                  sx: { textTransform: "uppercase", letterSpacing: 0.5 },
                }}
              />
            )}
          </BaseListItemButton>

          {/* Admin submenu items */}
          {adminNavItems.map(({ label, icon: Icon, href }) => {
            const selected = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <BaseListItemButton
                  selected={selected}
                  sx={{
                    pl: open ? 4 : 2, // indent submenu when open
                    "&.Mui-selected": {
                      backgroundColor: "rgb(var(--muted))",
                      color: "rgb(var(--foreground))",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "rgb(var(--muted))",
                    },
                  }}
                >
                  <BaseListItemIcon>
                    <Icon fontSize="small" />
                  </BaseListItemIcon>
                  {open && <BaseListItemText primary={label} />}
                </BaseListItemButton>
              </Link>
            );
          })}
        </BaseList>
      )}
    </BaseBox>
  );
}
