import { createClient, PostgrestResponse } from '@supabase/supabase-js';
import { FriendModel } from '../../models/friend.mode';
import { GroupModel } from '../../models/group.model';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_API || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
);

export const createGroup = async (data: GroupModel) => {
  const response: PostgrestResponse<GroupModel> = await supabase
    .from('groups')
    .insert(data)
    .select();
  return response.data;
};

export const createFriend = async (data: FriendModel) => {
  const response: PostgrestResponse<FriendModel> = await supabase
    .from('friends')
    .insert(data)
    .select();
  return response.data;
};

export default supabase;
