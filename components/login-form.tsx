/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, LogIn, CheckCircle } from "lucide-react";
import { webAuthnService } from "@/lib/webauthn-service";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginResult, setLoginResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setLoginResult(null);

    try {
      const result = await webAuthnService.login({ email });
      setLoginResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (loginResult) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
          <CardTitle className="text-green-800">Login Successful!</CardTitle>
          <CardDescription className="text-green-600">
            You have been authenticated successfully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Status:</strong> {loginResult.message}
            </div>
            <div>
              <strong>Verified:</strong>{" "}
              {loginResult.verification?.verified ? "Yes" : "No"}
            </div>
          </div>
          <Button
            onClick={() => {
              setLoginResult(null);
              setEmail("");
            }}
            className="w-full mt-4"
            variant="outline"
          >
            Login Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Authenticating...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Login with Biometrics
          </>
        )}
      </Button>
    </form>
  );
}
