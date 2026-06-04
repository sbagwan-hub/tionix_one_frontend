import { redirect } from 'next/navigation';

export default function Home() {
  // Middleware (proxy.ts) handles the actual routing based on auth state.
  // This is a fallback in case middleware is bypassed.
  redirect('/auth/login');
}
