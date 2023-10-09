export interface Theme {
  theme: string;
  setTheme: (theme: string) => void;
}

export interface Post {
  _id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  comments: Comment[];
}

export interface User {
  userName: string;
  email: string;
  password: string;
  image: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUser extends User {
  Cpassword: string;
}

export interface Categories {
  id: number;
  value: string;
  name: string;
}

export interface Token {
  token: string;
}

export interface PostData {
  title: string;
  body: string;
  category: string;
}

export interface UserData {
  userName: string;
  email: string;
}

export interface EditData {
  title: string;
  body: string;
}

export interface Comment {
  _id: string;
  text: string | number;
  createdAt: string;
  updatedAt: string;
  user: User;
}
