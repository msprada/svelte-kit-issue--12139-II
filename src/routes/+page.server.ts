import {redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async (event) => {

	console.error('redirect triggered in +page.server.ts!');
	redirect(307, '/signin');

};
