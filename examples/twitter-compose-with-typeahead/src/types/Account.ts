export type Account = {
  name: string;
  handle: string;
  image: string;
  verified: boolean;
  follows_me: boolean;
  followed_by_me: boolean;
  followers: number;
  following: number;
};
