import { supabase } from '$lib/db/db';
import { redirect } from '@sveltejs/kit';

export async function load({ url, cookies }) {
	const friendId = cookies.get('friendId');

	if (!friendId) {
		throw redirect('307', '/');
	}

	const { data: getFriend } = await supabase
		.from('friends')
		.select('name, email, group')
		.eq('id', friendId);
	const { data: getGroup } = await supabase
		.from('groups')
		.select('name, owner, starts_at')
		.eq('id', getFriend[0].group);
	const { data: getMembers } = await supabase
		.from('friends')
		.select('id, name, gift_preferences')
		.eq('group', getFriend[0].group);

	const groupOwner = getMembers.find((m) => m.id === getGroup[0].owner);

	console.log(url.searchParams.get('q'));

	return {
		group: {
			name: getGroup[0].name,
			owner: groupOwner.name,
			starts_at: getGroup[0].starts_at,
			friends: getMembers
		}
	};
}
