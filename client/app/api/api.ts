import axios from "axios";

export const getPosts = async () => {
  try {
    const data = await axios.get("https://forums-api.onrender.com/posts");
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getPost = async (_id: string) => {
  try {
    const data = await axios.get(
      `https://forums-api.onrender.com/posts/${_id}`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getUser = async (user: string) => {
  try {
    const data = await axios.get(`https://forums-api.onrender.com/users/${user}`);
    return data;
  } catch (error) {
    console.error(error);
  }
};
