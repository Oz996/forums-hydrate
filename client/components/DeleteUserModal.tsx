import { useAuth } from "@/hooks/useAuth";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const DeleteUserModal = ({ id }: { id: String }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { handleLogout, token } = useAuth();
  const router = useRouter();

  const deleteMutation = async (e: React.MouseEvent) => {
    const res = await axios.delete(
      `https://forums-api.onrender.com/users/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.status === 200) {
      router.push("/");
      toast.success("User deleted");
      handleLogout();
    }
  };

  return (
    <>
      <Button color="danger" onPress={onOpen}>
        Delete User
      </Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                User Deletion
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete your account? Account recovery
                  will not be possible
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  onClick={deleteMutation}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteUserModal;
