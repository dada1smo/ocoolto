export interface FriendModel {
  id?: string;
  name: string;
  access_token: number;
  group: number;
  excluded_friends?: string[];
  secret_friend?: string;
  email: string;
}
