"use client";

import BaseBox from "@/components/MUI/Layout/BaseBox";
import { BaseList } from "@/components/MUI/DataDisplay/BaseList";
import { BaseListItemButton } from "@/components/MUI/DataDisplay/BaseListItemButton";
import { BaseListItemIcon } from "@/components/MUI/DataDisplay/BaseListItemIcon";
import { BaseListItemText } from "@/components/MUI/DataDisplay/BaseListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LayoutSidebar({ open }: { open: boolean }) {
  const width = open ? 240 : 64;
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: HomeIcon, href: "/" },
    { label: "Messages", icon: ChatIcon, href: "/messages" },
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
      <BaseList sx={{ paddingY: 1 }}>
        {navItems.map(({ label, icon: Icon, href }) => {
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
    </BaseBox>
  );
}
