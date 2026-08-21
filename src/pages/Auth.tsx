import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/regions', { replace: true });
    });
    supabase.rpc('admin_exists').then(({ data, error }) => {
      if (!error) setNeedsBootstrap(data === false);
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: 'Sign in failed', description: 'Check your email and password.', variant: 'destructive' });
      return;
    }
    navigate('/admin/regions', { replace: true });
  };

  const handleCreateAdmin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Could not create account', description: error.message, variant: 'destructive' });
      return;
    }
    if (data.session) {
      navigate('/admin/regions', { replace: true });
    } else {
      toast({ title: 'Account created', description: 'You can now sign in.' });
      setNeedsBootstrap(false);
    }
  };


  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{needsBootstrap ? 'Create admin account' : 'Admin sign in'}</CardTitle>
          <CardDescription>
            {needsBootstrap
              ? 'No administrator exists yet. The first account you create becomes the administrator.'
              : 'Editorial administration for Caesar the Day.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={needsBootstrap ? 'new-password' : 'current-password'} />
            </div>
            {needsBootstrap ? (
              <Button type="button" className="w-full" disabled={loading || !email || password.length < 6} onClick={handleCreateAdmin}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create admin account
              </Button>
            ) : (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            )}
          </form>
        </CardContent>

      </Card>
    </main>
  );
}
