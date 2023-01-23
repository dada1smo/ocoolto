import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	try {
		const { session, supabaseClient } = await getSupabase(event);
		if (!session) {
			throw redirect(303, '/');
		}
		const userId = session.user.id;
		const { data: friends } = await supabaseClient
			.from('friends')
			.select(`name, group_id (id, name)`)
			.eq('user_id', userId);
		const groups = friends.map((f) => {
			return {
				label: f.group_id.name,
				id: f.group_id.id
			};
		});
		return {
			groups
		};
	} catch (error) {
		return {
			error
		};
	}
};

// https://github.com/supabase/auth-helpers/blob/main/packages/sveltekit/README.md
