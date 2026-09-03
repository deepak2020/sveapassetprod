import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { appParams } from '@/lib/app-params';
import { base44 } from '@/api/base44Client';

// Guard so we only redirect once even if multiple queries fail with 401
// at the same time (e.g. dashboard loads several queries in parallel).
let redirectingToLogin = false;

// When a user's token expires mid-session, entity/API calls return 401.
// Without this, pages just stay stuck on the same URL with no feedback.
// Only redirect if the user had a token (was logged in) — anonymous users
// browsing the public app should not be sent to the login page.
const handleAuthError = (error) => {
	if ((error?.status === 401) && appParams.token && !redirectingToLogin) {
		redirectingToLogin = true;
		base44.auth.redirectToLogin(window.location.href);
	}
};

export const queryClientInstance = new QueryClient({
	queryCache: new QueryCache({ onError: handleAuthError }),
	mutationCache: new MutationCache({ onError: handleAuthError }),
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			// Don't retry 401s — the token is expired, retrying won't help
			retry: (failureCount, error) => {
				if (error?.status === 401) return false;
				return failureCount < 1;
			},
		},
	},
});