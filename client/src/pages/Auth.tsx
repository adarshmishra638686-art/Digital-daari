import { FormEvent, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { ShieldCheck } from "lucide-react";

export default function AuthPage() {
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("adarshmishra638686@gmail.com");
  const [password, setPassword] = useState("Adarsh@2007");
  const [, setLocation] = useLocation();
  const adminLogin = trpc.auth.adminLogin.useMutation({
    onSuccess: async result => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Admin login successful");
      setLocation("/admin/blog");
    },
    onError: () => {
      toast.error("Login failed. Please try again.");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    adminLogin.mutate({
      email,
      password,
    });
  };

  if (!loading && isAuthenticated) {
    setLocation("/admin/blog");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">CMS Admin Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This login is private and only grants access to the Blog CMS admin page.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <Button className="w-full gap-2" size="lg" type="submit" disabled={adminLogin.isPending}>
            <ShieldCheck size={16} />
            {adminLogin.isPending ? "Signing in..." : "Sign In to CMS"}
          </Button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          Temporary credentials can be changed with CMS_ADMIN_EMAIL and CMS_ADMIN_PASSWORD env vars.
        </p>
      </div>
    </div>
  );
}
