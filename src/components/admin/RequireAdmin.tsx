import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

/**
 * Client-side gate for admin screens. This is a convenience only —
 * real enforcement lives in database RLS policies and edge function role checks.
 */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'loading' | 'allowed' | 'denied' | 'anonymous'>('loading');

  useEffect(() => {
    let active = true;

    const check = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!active) return;
      if (!sessionData.session) {
        setState('anonymous');
        return;
      }
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', sessionData.session.user.id)
        .eq('role', 'admin')
        .maybeSingle();
      if (!active) return;
      setState(!error && data ? 'allowed' : 'denied');
    };

    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      setState('loading');
      setTimeout(check, 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state === 'anonymous') return <Navigate to="/auth" replace />;

  if (state === 'denied') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Not authorised</h1>
        <p className="text-muted-foreground max-w-md">
          This account does not have administrator access.
        </p>
        <button
          className="text-sm underline"
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </button>
      </main>
    );
  }

  return <>{children}</>;
}
