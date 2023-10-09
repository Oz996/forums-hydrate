"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserCard from "@/components/UserCard";
import { getPost } from "../../api/api";
import CommentForm from "@/components/CommentForm";
import { Button, Input, Textarea, input } from "@nextui-org/react";
import { useAuth } from "@/hooks/useAuth";
import DeleteModal from "@/components/DeleteModal";
import { FieldValues, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { EditData, PostData, Comment } from "@/types/types";

export default function Post({ params }: { params: { _id: string } }) {
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();
  const { userEmail } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["post", params._id],
    queryFn: () => getPost(params._id),
  });
  console.log(data);

  const date = data?.data?.createdAt.slice(0, 10);
  const updated = data?.data?.updatedAt.slice(0, 10);

  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const handleEditClick = () => {
    setValue("title", data?.data?.title || "");
    setValue("body", data?.data?.body || "");
    setEditing((prev) => !prev);
  };

  const editMutation = async (data: EditData) => {
    await axios.put(
      `https://forums-api.onrender.com/posts/${params._id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const deleteCommentMutation = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    await axios.delete(
      `https://forums-api.onrender.com/posts/${params._id}/comments/${9}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const mutation = useMutation(editMutation, {
    onSuccess: () => {
      toast.success("Post updated");
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => {
      setEditing(false);
      queryClient.invalidateQueries(["post"]);
    },
  });

  const onSubmit = (data: FieldValues) => {
    mutation.mutate(data as EditData);
  };

  return (
    <section className="md:max-w-[62rem] mx-auto container pt-24 flex flex-col gap-10 md:gap-3">
      <div className="flex flex-col md:flex-row md:rounded-xl border">
        <div>
          <UserCard data={data?.data} />
        </div>
        <div className="flex flex-col p-10 w-full">
          <div className="flex flex-col md:flex-row justify-between">
            {!editing ? (
              <div>
                <h1 className="text-2xl text-center font-semibold mb-10">
                  {data?.data?.title}
                </h1>
                {!editing && (
                  <div className="flex  my-6 items-center gap-3">
                    <p className="text-gray-500 text-sm">Created at {date}</p>
                    <p className="text-gray-500 text-sm italic">
                      Edited at {updated}
                    </p>
                  </div>
                )}

                <p>{data?.data?.body}</p>
              </div>
            ) : (
              <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <Input
                  {...register("title")}
                  label="Title"
                  variant="underlined"
                  className="mb-5"
                  defaultValue=" "
                />
                <Textarea
                  {...register("body")}
                  label="Description"
                  variant="underlined"
                  className="w-full"
                />
                <Button variant="ghost" type="submit">
                  Confirm
                </Button>
              </form>
            )}
          </div>
          {userEmail === data?.data?.user?.email && (
            <div className="flex justify-end border-t mt-5">
              <Button
                variant="light"
                className="mt-2"
                onClick={handleEditClick}
              >
                {!editing ? "Edit" : "Cancel"}
              </Button>
              <DeleteModal id={params._id} />
            </div>
          )}
        </div>
      </div>
      {data?.data?.comments?.map((data: Comment) => (
        <div
          key={data._id}
          className="flex flex-col md:flex-row md:rounded-xl border w-full ml-auto md:w-[80%]"
        >
          <div>
            <UserCard data={data} />
          </div>
          <div className="flex flex-col p-10 w-full">
            <p>{data?.text}</p>
            {userEmail === data?.user?.email && (
              <div className="flex justify-end border-t mt-5">
                <Button variant="light" className="mt-2">
                  {!editing ? "Edit" : "Confirm"}
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  className="mt-2"
                  onClick={deleteCommentMutation}
                >
                  Delete
                </Button>
              </div>
            )}
            <p className="text-gray-500 text-sm my-6">
              Created at {data?.createdAt.slice(0, 10)}
            </p>
          </div>
        </div>
      ))}
      <CommentForm params={params} />
    </section>
  );
}
