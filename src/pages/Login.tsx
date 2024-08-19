import { Link, useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  signIn,
  fetchAuthSession,
  signInWithRedirect,
} from "aws-amplify/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();

  const onClickLogin = async (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;

    try {
      await signIn({
        username: form.elements.email.value,
        password: form.elements.password.value,
      });

      const currentUser = await getCurrentUser();
      const session: any = await fetchAuthSession();
      const tokens = session?.tokens || {};
      const idToken = tokens.idToken?.toString();
      const userEmail = tokens.signInDetails?.loginId?.toString();

      localStorage.setItem(
        "neouser",
        JSON.stringify({
          ...currentUser,
          idToken,
          userEmail,
        })
      );
      const user: any = localStorage.getItem("neouser");
      const parsedUser = JSON.parse(user);
      if (parsedUser) {
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Unable to login", error);
    }

    const user: any = localStorage.getItem("neouser");
    const parsedUser = JSON.parse(user);
    if (parsedUser) {
      console.log("redirect");
      navigate("/");
      return;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log("Sign in with google in useAuth hook");
      await signInWithRedirect({ provider: "Google" });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      console.log("finally  block");
      await getToken();
    }
  };

  const getToken = async () => {
    console.log("getToken block");
    const currentUser = await getCurrentUser();
    const session: any = await fetchAuthSession();
    const tokens = session?.tokens || {};
    const idToken = tokens.idToken?.toString();
    const userEmail = tokens.signInDetails?.loginId?.toString();

    localStorage.setItem(
      "neouser",
      JSON.stringify({
        ...currentUser,
        idToken,
        userEmail,
      })
    );
    const user: any = localStorage.getItem("neouser");
    const parsedUser = JSON.parse(user);
    if (parsedUser) {
      navigate("/");
      return;
    }
  };
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <form className="grid gap-4" onSubmit={onClickLogin}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="ml-auto inline-block text-sm underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          Login with Google
        </Button>
        <Button variant="outline" className="w-full" onClick={getToken}>
          getToken
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/" className="underline">
          Register
        </Link>
      </div>
    </div>
  );
}
