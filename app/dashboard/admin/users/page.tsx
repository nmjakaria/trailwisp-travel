"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Spinner,
  Card,
  Modal,
} from "@heroui/react";
import { Search, X, ShieldAlert, UserX, AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { getUsers, updateUserRole, deleteUser, UserItem } from "@/lib/api/users";

const ROLE_STYLES: Record<UserItem["role"], { dot: string; text: string; bg: string; ring: string }> = {
  admin: { dot: "bg-rose-500", text: "text-rose-700 dark:text-rose-300", bg: "bg-rose-50 dark:bg-rose-500/10", ring: "ring-rose-200 dark:ring-rose-500/20" },
  moderator: { dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-500/10", ring: "ring-amber-200 dark:ring-amber-500/20" },
  user: { dot: "bg-zinc-400", text: "text-zinc-600 dark:text-zinc-300", bg: "bg-zinc-100 dark:bg-zinc-850", ring: "ring-zinc-200 dark:ring-zinc-800" },
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Controlled Modal State using useOverlayState style (boolean toggle)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; email: string } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    await getUsers(currentPage, 10, debouncedSearch)
      .then((data) => {
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
        setTotalUsers(data.totalUsers || 0);
      })
      .catch((err) => {
        console.error("Error retrieving dashboard users:", err);
        showToast("error", "Failed to retrieve user logs.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearch]);

  // Keep current page in range after deletes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleRoleChange = (userId: string, newRole: UserItem["role"]) => {
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole);
        showToast("success", `User role updated to ${newRole}.`);
        fetchUsers();
      } catch (err) {
        showToast("error", "Failed to modify user role. Ensure you have the permissions needed.");
      }
    });
  };

  const confirmDeleteUser = (userId: string, email: string) => {
    setUserToDelete({ id: userId, email });
    setIsModalOpen(true);
  };

  const executeDeleteUser = () => {
    if (!userToDelete) return;
    setIsModalOpen(false);

    startTransition(async () => {
      try {
        await deleteUser(userToDelete.id);
        showToast("success", "User account permanently deleted.");
        fetchUsers();
      } catch (err) {
        showToast("error", "Unable to delete user profile from database.");
      } finally {
        setUserToDelete(null);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative">
      
      {/* Toast Overlay */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] animate-in fade-in slide-in-from-top-4 duration-300">
          <Card className={`p-4 border shadow-xl flex flex-row items-center gap-3 min-w-[300px] ${
            toast.type === "success" 
              ? "bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200" 
              : "bg-rose-50/95 dark:bg-rose-950/90 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
          }`}>
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            )}
            <div className="text-sm font-medium pr-4">{toast.message}</div>
            <button 
              onClick={() => setToast(null)} 
              className="ml-auto text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            Manage System Users
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Search, update authorization levels, or remove registered profiles.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 px-5 py-3 rounded-2xl shadow-sm">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tabular-nums leading-none">{totalUsers}</span>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1">
              Registered Accounts
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <Card className="p-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:max-w-xs flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" />
          <Input
            className="w-full"
            
            placeholder="Filter by name or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-full p-0.5 transition-colors"
              aria-label="Clear filter"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        {isPending && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold ml-1">
            <Spinner size="sm" color="indigo" />
            Syncing database changes…
          </div>
        )}
      </Card>

      {/* Table Section */}
      <div className="border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-zinc-900">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Database user entries table" className="min-w-[640px]">
              <Table.Header>
                <Table.Column id="user" isRowHeader className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 py-4 pl-6">
                  Name &amp; Email
                </Table.Column>
                <Table.Column id="role" className="font-bold text-[11px] uppercase tracking-wider text-zinc-500">
                  Role
                </Table.Column>
                <Table.Column id="created" className="font-bold text-[11px] uppercase tracking-wider text-zinc-500">
                  Created On
                </Table.Column>
                <Table.Column id="actions" className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 text-right pr-6">
                  Actions
                </Table.Column>
              </Table.Header>

              <Table.Body>
                {loading ? (
                  <Table.Row id="loading">
                    <Table.Cell colSpan={4}>
                      <div className="flex items-center justify-center gap-3 py-16">
                        <Spinner size="md" color="primary" />
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Searching database...</span>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ) : users.length === 0 ? (
                  <Table.Row id="empty">
                    <Table.Cell colSpan={4}>
                      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                        <UserX className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
                        <span className="text-base font-semibold text-zinc-700 dark:text-zinc-300">No users match your query</span>
                        <span className="text-xs text-zinc-400 max-w-xs">Double check spelling or search parameters and try again.</span>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  users.map((user) => {
                    const role = ROLE_STYLES[user.role];
                    return (
                      <Table.Row
                        key={user._id}
                        id={user._id}
                        className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-none"
                      >
                        <Table.Cell className="pl-6">
                          <div className="flex items-center gap-3 py-2.5">
                            <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ring-1 ${role.bg} ${role.text} ${role.ring}`}>
                              {initials(user.name)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm truncate">
                                {user.name}
                              </span>
                              <span className="text-xs text-zinc-400 truncate">{user.email}</span>
                            </div>
                          </div>
                        </Table.Cell>

                        <Table.Cell>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${role.bg} ${role.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${role.dot}`} />
                            {user.role}
                          </span>
                        </Table.Cell>

                        <Table.Cell>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </Table.Cell>

                        <Table.Cell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <Dropdown>
                              <DropdownTrigger>
                                <Button size="sm" variant="flat" color="primary" className="font-bold text-xs">
                                  Change Role
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label="Select roles"
                                onAction={(key) => handleRoleChange(user._id, key as UserItem["role"])}
                              >
                                <DropdownItem key="user" className="text-zinc-700 dark:text-zinc-300">
                                  Set as User
                                </DropdownItem>
                                <DropdownItem key="moderator" className="text-amber-600 dark:text-amber-400 font-semibold">
                                  Promote to Moderator
                                </DropdownItem>
                                <DropdownItem
                                  key="admin"
                                  className="text-rose-600 dark:text-rose-400 font-black"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5" /> Promote to Admin
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                            <Button
                              size="sm"
                              variant="bordered"
                              color="danger"
                              onClick={() => confirmDeleteUser(user._id, user.email)}
                              className="font-bold text-xs"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>

        {/* Dynamic Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-center bg-zinc-50/50 dark:bg-zinc-900/30">
            <Pagination
              showControls
              showShadow
              color="primary"
              page={currentPage}
              total={totalPages}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      {/* Correct HeroUI v3 Compound Modal Structure */}
      <Modal state={{ isOpen: isModalOpen, setOpen: setIsModalOpen }}>
        <Modal.Backdrop variant="blur" isDismissable={true}>
          <Modal.Container size="md">
            <Modal.Dialog className="sm:max-w-[440px]">
              <Modal.CloseTrigger />
              
              <Modal.Header className="flex gap-2.5 items-center text-rose-600">
                <Modal.Icon>
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                </Modal.Icon>
                <Modal.Heading className="text-lg font-black">
                  Delete User Account?
                </Modal.Heading>
              </Modal.Header>
              
              <Modal.Body className="py-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Are you sure you want to permanently remove the user account for{" "}
                  <strong className="text-zinc-800 dark:text-zinc-200 break-all">{userToDelete?.email}</strong>? 
                  This action cannot be undone, and the user will lose all system access immediately.
                </p>
              </Modal.Body>
              
              <Modal.Footer className="gap-2 mt-4">
                <Button 
                  variant="flat" 
                  color="default" 
                  onClick={() => setIsModalOpen(false)} 
                  className="font-semibold text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  color="danger" 
                  onClick={executeDeleteUser} 
                  className="font-bold text-xs" 
                >
                  <Trash2 className="w-4 h-4" /> Permanently Delete
                </Button>
              </Modal.Footer>
              
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}