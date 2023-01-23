import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	try {
		const { session, supabaseClient } = await getSupabase(event);
		if (!session) {
			throw redirect(303, '/');
		}
		const groupId = event.params.id;
		const { data: groups } = await supabaseClient
			.from('groups')
			.select(`name, starts_at, owner_id (name)`)
			.eq('id', groupId);
		console.log(groups);
		const { data: friends } = await supabaseClient
			.from('friends')
			.select(`id, name, gift_preferences`)
			.eq('group_id', groupId);
		const group = {
			name: groups[0].name,
			owner: groups[0].owner_id.name,
			starts_at: groups[0].starts_at,
			friends
		};
		return {
			group
		};
	} catch (error) {
		console.log(error);
		return {
			error
		};
	}
};

// export async function load({ url, cookies }) {
// 	const friendId = cookies.get('friendId');

// 	const { data: getFriend } = await supabase
// 		.from('friends')
// 		.select('name, email, group')
// 		.eq('id', friendId);
// 	const { data: getGroup } = await supabase
// 		.from('groups')
// 		.select('name, owner, starts_at')
// 		.eq('id', getFriend[0].group);
// 	const { data: getMembers } = await supabase
// 		.from('friends')
// 		.select('id, name, gift_preferences')
// 		.eq('group', getFriend[0].group);

// 	const groupOwner = getMembers.find((m) => m.id === getGroup[0].owner);

// 	console.log(url.searchParams.get('q'));

// 	return {
// 		group: {
// 			name: getGroup[0].name,
// 			owner: groupOwner.name,
// 			starts_at: getGroup[0].starts_at,
// 			friends: getMembers
// 		}
// 	};
// }
