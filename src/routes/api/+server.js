import { json } from '@sveltejs/kit';

export function GET(event) {
	console.log('GET request received in /api/+server.js, evnent:', event);
	const number = Math.floor(Math.random() * 6) + 1;

	return json(number);
}