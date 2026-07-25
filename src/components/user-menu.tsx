import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, User as UserIcon, Shield } from "lucide-react";
import { useAuth, ROLE_LABEL } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function initials(name: string | null | undefined, email: string | null | undefined) {
  const src = (name || email || "?").trim();
  const parts = src.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function UserMenu() {
  const { isAuthenticated, user, role, displayName, hasRole, signOut, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />;

  if (!isAuthenticated) {
    return (
      <Button asChild size="sm" className="rounded-full">
        <Link to="/auth">Sign in</Link>
      </Button>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card font-semibold text-xs">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials(displayName, user?.email)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="text-sm font-semibold">{displayName || user?.email}</span>
          <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
          {role && (
            <Badge variant="secondary" className="mt-1 w-fit rounded-full text-[10px]">
              {ROLE_LABEL[role]}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hasRole(["ta", "professor"]) && (
          <DropdownMenuItem asChild>
            <Link to="/admin">
              <Shield className="h-4 w-4" /> Admin panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem disabled>
          <UserIcon className="h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut}>
          <LogOut className="h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
