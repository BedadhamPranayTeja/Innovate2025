import { Crown, MoreHorizontal, UserMinus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeamMember } from "@/types";
import { cn } from "@/lib/utils";

interface MemberListProps {
  members: TeamMember[];
  currentUserId?: string;
  isLeader?: boolean;
  onRemoveMember?: (memberId: string) => void;
}

export function MemberList({
  members,
  currentUserId,
  isLeader = false,
  onRemoveMember,
}: MemberListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const isCurrentUser = member.userId === currentUserId;
        const isMemberLeader = member.role === "leader";

        return (
          <div
            key={member.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-colors",
              isCurrentUser && "bg-primary/5 border-primary/20"
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.user.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(member.user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{member.user.name}</span>
                {isMemberLeader && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Crown className="w-3 h-3" />
                    Leader
                  </Badge>
                )}
                {isCurrentUser && (
                  <Badge variant="secondary" className="text-xs">
                    You
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {member.user.email}
              </p>
            </div>

            {isLeader && !isMemberLeader && onRemoveMember && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onRemoveMember(member.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <UserMinus className="w-4 h-4 mr-2" />
                    Remove from team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      })}

      {members.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No members yet
        </div>
      )}
    </div>
  );
}
