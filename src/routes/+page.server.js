// import { supabase } from '$lib/db/db';

// export const actions = {
// 	create: async (event) => {
// 		const data = await event.request.formData();
// 		const groupName = data.get('group_name');
// 		const name = data.get('name');
// 		const email = data.get('email');
// 		const accessToken = data.get('access_token');

// 		const createGroup = await supabase.from('groups').insert({ name: groupName }).select();

// 		const createFriend = await supabase
// 			.from('friends')
// 			.insert({
// 				name: name,
// 				email: email,
// 				access_token: accessToken,
// 				group: createGroup.data[0].id
// 			})
// 			.select();

// 		await supabase
// 			.from('groups')
// 			.update({ owner: createFriend.data[0].id })
// 			.eq('id', createGroup.data[0].id);

// 		event.cookies.set('friendId', createFriend.data[0].id);

// 		return { success: true };
// 	}
// };

import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { fail } from '@sveltejs/kit';

export const actions = {
	async default(event) {
		const { request, url } = event;
		const { supabaseClient } = await getSupabase(event);

		const formData = await request.formData();
		const email = formData.get('email');

		const { error } = await supabaseClient.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${url.origin}/logging-in`
			}
		});

		if (error) {
			return fail(400, {
				error: error.message,
				values: { email }
			});
		}

		return {
			success: true,
			message:
				'Enviamos para seu e-mail um link mágico para acessar o site. Você pode fechar essa página.'
		};
	}
};
