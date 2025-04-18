export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password?: string; // optional or can be omitted in API responses
  createdAt: string;
  updatedAt: string;
  __v: number;
  privacy: {
    profile_visibility: boolean;
    search_visibility: boolean;
    comments: boolean;
    data_collection: boolean;
  };
  notifications: {
    comments: boolean;
    likes: boolean;
    follows: boolean;
    messages: boolean;
    marketing: boolean;
  };
}
