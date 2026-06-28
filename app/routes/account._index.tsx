import {useLoaderData, data} from 'react-router';
// This pulls the auto-generated types matching this route's filename
import type {Route} from './+types/account._index';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hawker Store | Account'}];
};

// 1. SERVER-SIDE: Only returns data payload or handles redirects
export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;

  // Best Practice: Check if user is actually authorized.
  // If not, this helper handles the secure login redirect automatically.
  const isLoggedIn = await customerAccount.isLoggedIn();
  if (!isLoggedIn) {
    return customerAccount.login();
  }

  // Fetch optional dashboard information from Customer Account API if needed
  return data({
    welcomeMessage: 'Welcome back to Hawker Store',
  });
}

// 2. CLIENT-SIDE LAYOUT: Where you apply your Tailwind utility classes
export default function AccountIndex() {
  const {welcomeMessage} = useLoaderData<typeof loader>();

  return (
    <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-neutral-900">
        Dashboard Overview
      </h2>
      <p className="mt-2 text-sm text-neutral-600">{welcomeMessage}</p>

      {/* You can build custom overview layout widgets here with Tailwind */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg border border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-800">
            Recent Activity
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            No recent actions recorded.
          </p>
        </div>
      </div>
    </div>
  );
}
