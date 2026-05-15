import { Menu, MenuItem } from "../../../components/ui/Menu";

interface UserMenuProps {
  name?: string;
  email?: string;
  onProfileClick: () => void;
  onLogout: () => void;
}

const getInitials = (name?: string) => {
  if (!name) return "?";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const UserMenu = ({
  name,
  email,
  onProfileClick,
  onLogout,
}: UserMenuProps) => {
  return (
    <Menu
      trigger={
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 hover:bg-[var(--muted)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--muted)] text-sm font-bold">
            {getInitials(name)}
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-4">{name || "User"}</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {email || "-"}
            </p>
          </div>
        </div>
      }
    >
      <div className="border-b border-[var(--border)] px-3 py-2">
        <p className="text-sm font-semibold">{name || "User"}</p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          {email || "-"}
        </p>
      </div>

      <div className="mt-2 space-y-1">
        <MenuItem onClick={onProfileClick}>View / Edit Profile</MenuItem>
        <MenuItem onClick={onLogout} variant="danger">
          Logout
        </MenuItem>
      </div>
    </Menu>
  );
};