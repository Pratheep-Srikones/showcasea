export interface UserType {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password?: string; // optional or can be omitted in API responses
  createdAt: string;
  updatedAt?: string;
  bio?: string;
  profile_picture_url?: string;
  __v?: number;
  privacy?: {
    profile_visibility: boolean;
    search_visibility: boolean;
    comments: boolean;
    data_collection: boolean;
  };
  notifications?: {
    comments: boolean;
    likes: boolean;
    follows: boolean;
    messages: boolean;
    marketing: boolean;
  };
  social_media?: {
    website: string;
    twitter: string;
    instagram: string;
  };
  followerCount?: number;
  followingCount?: number;
}

export interface ArtworkType {
  _id: string;
  title: string;
  description: string;
  image_urls: string[];
  tags: string[];
  artist: UserType; // Assuming artist is of type UserType
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isPublic: boolean;
  __v: number;
}

export interface CommentType {
  _id: string;
  artWorkId: string;
  userId: UserType; // Assuming this is a reference to the UserType
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NotificationType {
  _id?: string;
  recipient: string;
  sender?: UserType;
  type: "like" | "comment" | "follow" | "system";
  artwork?: ArtworkType;
  comment?: string;
  isRead?: boolean;
  readAt?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
export interface ChatType {
  _id?: string;
  participants: UserType[]; // or: User[] if fully populated
  lastMessage?: MessageType; // or: Message if populated
  unreadCounts: Map<string, number>;
  createdAt?: string;
  updatedAt?: string;
}

export interface MessageType {
  _id?: string;
  sender: UserType; // User ID as string
  chat: string; // Chat ID as string
  content: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}
