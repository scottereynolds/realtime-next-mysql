"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import BaseBox from "@/components/MUI/Layout/BaseBox";
import { BaseTextField } from "@/components/MUI/Inputs/BaseTextField";
import { BaseButton } from "@/components/MUI/Inputs/BaseButton";
import { BaseTypography } from "@/components/MUI/DataDisplay/BaseTypography";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Failed to register.");
        setSubmitting(false);
        return;
      }

      // Auto-sign in after successful registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/",
      });

      setSubmitting(false);

      if (signInRes?.error) {
        // Registered but couldn’t sign in; just send them to login
        router.push("/login");
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Unexpected error while registering.");
      setSubmitting(false);
    }
  };

  return (
    <BaseBox
      sx={{
        minHeight: "calc(100vh - 64px - 40px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <BaseBox
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: "var(--radius-lg)",
          border: "1px solid rgb(var(--border))",
          padding: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "rgb(var(--background))",
        }}
      >
        <BaseTypography variant="h5">Create an account</BaseTypography>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <BaseTextField
            label="Name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            fullWidth
          />

          <BaseTextField
            label="Email"
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <BaseTextField
            label="Password"
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            required
            fullWidth
          />

          {error && (
            <BaseTypography variant="body2" sx={{ color: "red" }}>
              {error}
            </BaseTypography>
          )}

          <BaseButton
            type="submit"
            disabled={submitting}
            fullWidth
            variant="contained"
          >
            {submitting ? "Creating account..." : "Sign up"}
          </BaseButton>
        </form>
      </BaseBox>
    </BaseBox>
  );
}
