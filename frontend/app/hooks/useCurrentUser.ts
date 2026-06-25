import { useUser } from '@auth0/nextjs-auth0';
import { useEffect } from 'react';

//Identify if the user is already in the database
export async function useCurrentUser() {
  async function userSync() {
    const res = await fetch(
      `https://${process.env.APP_BASE_URL}/api/users/${id}`,
    );
  }
}
