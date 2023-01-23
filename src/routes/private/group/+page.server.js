import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const actions = {
	create: async (event) => {
		const { session, supabaseClient } = await getSupabase(event);

		const userId = session.user.id;
		const email = session.user.email;
		const data = await event.request.formData();
		const groupName = data.get('group_name');
		const name = data.get('name');

		const createGroup = await supabaseClient
			.from('groups')
			.insert({ name: groupName, user_id: userId })
			.select();

		const createFriend = await supabaseClient
			.from('friends')
			.insert({
				name: name,
				email: email,
				user_id: userId,
				group_id: createGroup.data[0].id
			})
			.select();

		await supabaseClient
			.from('groups')
			.update({ owner_id: createFriend.data[0].id })
			.eq('id', createGroup.data[0].id);

		return { success: true };
	}
};
