"use client";
import { getUser } from "@/app/api/api";
import DeleteUserModal from "@/components/DeleteUserModal";
import PostCard from "@/components/PostCard";
import UserCard from "@/components/UserCard";
import { useAuth } from "@/hooks/useAuth";
import { Comment, Post, UserData } from "@/types/types";
import { Button, Card, Input } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function User({ params }: { params: { user: string } }) {
  console.log(params.user);
  const [editing, setEditing] = useState(false);
  const { data } = useQuery({
    queryKey: ["user", params.user],
    queryFn: () => getUser(params.user),
  });

  const { userEmail, token } = useAuth();
  const queryClient = useQueryClient();
  console.log(data);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleEditClick = () => {
    setValue("email", data?.data?.user?.email || "");
    setValue("userName", data?.data?.user?.userName || "");
    setEditing((prev) => !prev);
  };

  const userMutation = async (data: UserData) => {
    const res = await axios.put(
      `https://forums-api.onrender.com/users/${params.user}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const mutation = useMutation(userMutation, {
    onSuccess: () => {
      setEditing(false);
      toast.success("User updated");
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });

  const onSubmit = (data: FieldValues) => {
    mutation.mutate(data as UserData);
  };

  const email = data?.data?.user?.email;

  return (
    <section className="pt-24">
      <div className="md:max-w-[62rem] mx-auto flex flex-col gap-5">
        <Card className="md:p-10 md:px-20 p-3">
          <div className="flex justify-between flex-col md:flex-row gap-4">
            <div className="md:border-r-1">
              <UserCard data={data?.data} />
            </div>
            {!editing ? (
              <div className="grid grid-cols-2 my-auto gap-2">
                <p className="font-semibold">Email</p> <p>{email}</p>
                <p className="font-semibold">Username</p>{" "}
                <p>{data?.data?.user?.userName}</p>
                {userEmail === email && (
                  <>
                    <Button
                      onClick={handleEditClick}
                      className="font-semibold"
                      color="primary"
                    >
                      Edit
                    </Button>
                    <DeleteUserModal id={data?.data?.user?._id} />
                  </>
                )}
              </div>
            ) : (
              <div className="md:w-[17rem] w-full">
                <form
                  className="flex flex-col gap-3"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    {...register("email", {
                      required: "Email cannot be empty",
                    })}
                    label="Email"
                    defaultValue=" "
                  />
                  <ErrorMessage
                    errors={errors}
                    name="email"
                    render={({ message }) => (
                      <p className="text-red-500 text-sm font-semibold">
                        {message}
                      </p>
                    )}
                  ></ErrorMessage>
                  <Input
                    {...register("userName", {
                      required: "Username cannot be empty",
                    })}
                    defaultValue=" "
                    label="Username"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="userName"
                    render={({ message }) => (
                      <p className="text-red-500 text-sm font-semibold">
                        {message}
                      </p>
                    )}
                  ></ErrorMessage>
                  <div className="flex">
                    <Button className="w-[70%]" type="submit" color="secondary">
                      Submit
                    </Button>
                    <Button
                      className="w-[30%]"
                      color="danger"
                      variant="light"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </Card>
        <Card className="md:p-10 md:px-20 py-5">
          <h2 className="text-center text-xl font-semibold mb-5">
            {userEmail === email ? "Your Posts" : "Users Posts"}
          </h2>
          {data?.data?.posts?.map((post: Post) => (
            <PostCard key={post?._id} post={post} />
          ))}
        </Card>
        <Card className="p-10 px-20 py-5">
          <h3 className="text-center text-xl font-semibold mb-5">
            {userEmail === email
              ? "Your Latest Comments"
              : "Users Latest Comments"}
          </h3>
          {data?.data?.comments?.map((comment: Comment) => (
            <div key={comment?._id}>
              <p>{comment?.text}</p>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
