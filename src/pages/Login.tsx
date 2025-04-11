
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Login successful",
          description: "Welcome back to SmileSmart!",
        });
        
        navigate('/home');
      } else {
        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Account created",
          description: "Your account has been created successfully. Please check your email for verification.",
        });
        
        // Switch back to sign in mode
        setMode('signin');
      }
    } catch (error: any) {
      toast({
        title: mode === 'signin' ? "Login failed" : "Signup failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dental-gray p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Stethoscope className="h-12 w-12 text-dental-blue" />
          </div>
          <CardTitle className="text-2xl font-bold text-dental-dark-blue">
            {mode === 'signin' ? 'Sign In to SmileSmart' : 'Create an Account'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {mode === 'signin' 
              ? 'Enter your credentials to access your account' 
              : 'Fill in the form to create a new account'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-dental-blue hover:bg-dental-dark-blue" 
              disabled={isLoading}
            >
              {isLoading 
                ? (mode === 'signin' ? "Signing in..." : "Signing up...") 
                : (mode === 'signin' ? "Sign In" : "Sign Up")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground mt-2">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-dental-blue hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-dental-blue hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
