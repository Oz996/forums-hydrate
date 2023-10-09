import { useAuth } from "@/hooks/useAuth";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

const UserMenu = () => {
  const { userEmail, userId, handleLogout } = useAuth();

  const handleLogoutClick = () => {
    handleLogout();
    toast.success("Signed out");
  };
  return (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <Button className="text-white" size="sm" variant="light">
          <FaUser size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-3 flex flex-col gap-3">
          <div className="text-small font-bold">{userEmail}</div>
            <Link href={`/user/${userId}`}>Edit User</Link>
          <div className="cursor-pointer" onClick={handleLogoutClick}>
            Logout
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
