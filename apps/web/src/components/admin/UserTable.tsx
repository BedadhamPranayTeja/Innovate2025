import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  MoreHorizontal, 
  Shield, 
  User, 
  Scale,
  Ban,
  CheckCircle,
  Mail 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/types";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "suspended";
  teamName?: string;
  createdAt: Date;
}

// Mock users for demo
const mockUsers: UserData[] = [
  { id: "1", name: "Alice Chen", email: "alice@demo.com", role: Role.STUDENT, status: "active", teamName: "Code Crusaders", createdAt: new Date("2024-11-01") },
  { id: "2", name: "Bob Smith", email: "bob@demo.com", role: Role.STUDENT, status: "active", teamName: "Blockchain Builders", createdAt: new Date("2024-11-05") },
  { id: "3", name: "Carol Davis", email: "carol@demo.com", role: Role.JUDGE, status: "active", createdAt: new Date("2024-10-20") },
  { id: "4", name: "David Lee", email: "david@demo.com", role: Role.STUDENT, status: "suspended", teamName: "Green Tech", createdAt: new Date("2024-11-10") },
  { id: "5", name: "Eva Martinez", email: "eva@demo.com", role: Role.ADMIN, status: "active", createdAt: new Date("2024-10-01") },
  { id: "6", name: "Frank Wilson", email: "frank@demo.com", role: Role.JUDGE, status: "active", createdAt: new Date("2024-10-25") },
  { id: "7", name: "Grace Kim", email: "grace@demo.com", role: Role.STUDENT, status: "active", createdAt: new Date("2024-11-15") },
  { id: "8", name: "Henry Brown", email: "henry@demo.com", role: Role.STUDENT, status: "active", teamName: "Code Crusaders", createdAt: new Date("2024-11-08") },
];

const roleIcons = {
  [Role.STUDENT]: User,
  [Role.JUDGE]: Scale,
  [Role.ADMIN]: Shield,
};

const roleColors = {
  [Role.STUDENT]: "bg-role-student/10 text-role-student border-role-student/30",
  [Role.JUDGE]: "bg-role-judge/10 text-role-judge border-role-judge/30",
  [Role.ADMIN]: "bg-role-admin/10 text-role-admin border-role-admin/30",
};

export function UserTable() {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    toast.success("Role updated successfully");
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u
      )
    );
    const user = users.find((u) => u.id === userId);
    toast.success(`User ${user?.status === "active" ? "suspended" : "reactivated"}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value={Role.STUDENT}>Students</SelectItem>
            <SelectItem value={Role.JUDGE}>Judges</SelectItem>
            <SelectItem value={Role.ADMIN}>Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Team</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {
              const RoleIcon = roleIcons[user.role];
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={roleColors[user.role]}>
                      <RoleIcon className="w-3 h-3 mr-1" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-muted-foreground">
                      {user.teamName || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant={user.status === "active" ? "default" : "destructive"}
                      className={user.status === "active" ? "bg-success/10 text-success border-success/30" : ""}
                    >
                      {user.status === "active" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <Ban className="w-3 h-3 mr-1" />
                      )}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info(`Emailing ${user.email}`)}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, Role.STUDENT)}>
                          <User className="w-4 h-4 mr-2" />
                          Set as Student
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, Role.JUDGE)}>
                          <Scale className="w-4 h-4 mr-2" />
                          Set as Judge
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user.id)}
                          className={user.status === "active" ? "text-destructive" : "text-success"}
                        >
                          {user.status === "active" ? (
                            <>
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend User
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Reactivate User
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Showing {filteredUsers.length} of {users.length} users
      </p>
    </motion.div>
  );
}
