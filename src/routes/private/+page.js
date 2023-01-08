import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/');
	}
	const { data: testTable } = await supabaseClient.from('test').select('*');
	return {
		testTable,
		user: session.user
	};
};

// https://github.com/supabase/auth-helpers/blob/main/packages/sveltekit/README.md
