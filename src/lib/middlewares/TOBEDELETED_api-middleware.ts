import { error, type RequestEvent } from '@sveltejs/kit';

export function protectApiRoute(event: RequestEvent, requiredRoles?: string[]) {
	// 1. Check authentication
	if (!event.locals.user) {
		throw error(401, 'Unauthorized');
	}

	// 2. Check roles if specified
	if (requiredRoles && !requiredRoles.includes(event.locals.user.role)) {
		throw error(403, 'Forbidden');
	}
}