import { Button, Textarea } from "@nextui-org/react";
import { FieldValues, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { Comment } from "@/types/types";
import { useAuth } from "@/hooks/useAuth";

const CommentForm = ({ params }: {params: {_id: string}}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient()
  const {token} = useAuth()

  const commentMutation = async (data: Comment) => {
    const res = await axios.post(
      `https://forums-api.onrender.com/posts/${params._id}/comments`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  };

  const mutation = useMutation(commentMutation, {
    onSuccess: () => {
      toast.success("Comment posted")
      queryClient.invalidateQueries(["post"])
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => {
      reset();
    },
  });

  const onSubmit = (data: FieldValues) => {
    mutation.mutate(data as Comment);
  };
  return (
    <section className="p-10 md:rounded-xl border">
      <h2 className="font-bold text-xl">Add Comment</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textarea
          {...register("text", { required: "Comment can not be empty" })}
          type="text"
        />
        <ErrorMessage
          name="text"
          errors={errors}
          render={({ message }) => (
            <p className="text-red-500 text-sm font-semibold">{message}</p>
          )}
        ></ErrorMessage>

        <div className="flex justify-between mt-5 items-center">
          <p>Characters left</p>
          <Button type="submit" color="secondary" className="py-6">
            Post Comment
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CommentForm;
