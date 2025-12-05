import { Check, X, Clock, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JoinRequest, MemberStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface JoinRequestCardProps {
  request: JoinRequest;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function JoinRequestCard({ request, onApprove, onReject }: JoinRequestCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isPending = request.status === MemberStatus.PENDING;

  return (
    <Card className={!isPending ? "opacity-60" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={request.user.avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(request.user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{request.user.name}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{request.user.email}</p>
            
            {request.message && (
              <div className="mt-2 p-2 rounded-md bg-muted/50 text-sm">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <MessageSquare className="w-3 h-3" />
                  Message
                </div>
                {request.message}
              </div>
            )}
          </div>
        </div>

        {isPending && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onReject(request.id)}
            >
              <X className="w-4 h-4 mr-1" />
              Decline
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onApprove(request.id)}
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
          </div>
        )}

        {request.status === MemberStatus.APPROVED && (
          <div className="mt-4 pt-4 border-t text-sm text-success flex items-center gap-1">
            <Check className="w-4 h-4" />
            Approved
          </div>
        )}

        {request.status === MemberStatus.REJECTED && (
          <div className="mt-4 pt-4 border-t text-sm text-destructive flex items-center gap-1">
            <X className="w-4 h-4" />
            Declined
          </div>
        )}
      </CardContent>
    </Card>
  );
}
