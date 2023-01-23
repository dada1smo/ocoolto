import '$lib/db/db.js';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, error } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/private')) {
		const { session, supabaseClient } = await getSupabase(event);

		if (!session) {
			throw redirect(303, '/');
		}
	}

	if (event.url.pathname.startsWith('/private') && event.request.method === 'POST') {
		const { session, supabaseClient } = await getSupabase(event);

		if (!session) {
			throw error(303, '/');
		}
	}

	return resolve(event);
};
