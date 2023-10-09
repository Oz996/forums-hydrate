import { Hydrate, dehydrate } from "@tanstack/react-query";
import { getPosts } from "./api/api";
import getQueryClient from "./getQueryClient";
import Posts from "@/components/Posts";

export default async function PostsWrapper() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["posts"], getPosts);
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Posts />
    </Hydrate>
  );
}
