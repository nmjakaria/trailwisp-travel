/* eslint-disable react-hooks/set-state-in-effect */
// app/components/theme-switcher.tsx
"use client";

import React, { useEffect, useState, Key } from "react";
import { Dropdown, Label } from "@heroui/react";
import { Display, Moon, Sun } from "@gravity-ui/icons";
import { useTheme } from "next-themes";

export function ThemeSwitcher(): React.JSX.Element | null {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const activeTheme = theme === "system" ? resolvedTheme : theme;

  const renderActiveIcon = (): React.JSX.Element => {
    if (activeTheme === "light") return <Sun className="w-4 h-4" />;
    if (activeTheme === "dark") return <Moon className="w-4 h-4" />;
    return <Display className="w-4 h-4" />;
  };

  const handleAction = (key: Key): void => {
    setTheme(String(key));
  };

  // Convert the theme string into a Set of strings for HeroUI's selectedKeys requirement
  const selectedKeys = theme ? new Set<string>([theme]) : new Set<string>();

  return (
    <Dropdown>
      <Dropdown.Trigger className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-default-200 bg-default-50/50 text-foreground hover:bg-default-100 transition-colors duration-200 cursor-pointer select-none">
        {renderActiveIcon()}
      </Dropdown.Trigger>
      
      <Dropdown.Popover>
        <Dropdown.Menu 
          aria-label="Theme selection"
          selectionMode="single"
          selectedKeys={selectedKeys}
          onAction={handleAction}
        >
          <Dropdown.Item id="light" textValue="Light Theme" className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            <Label>Light</Label>
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
          
          <Dropdown.Item id="dark" textValue="Dark Theme" className="flex items-center gap-2">
            <Moon className="w-4 h-4" />
            <Label>Dark</Label>
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
          
          <Dropdown.Item id="system" textValue="System Theme" className="flex items-center gap-2">
            <Display className="w-4 h-4" />
            <Label>System</Label>
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}