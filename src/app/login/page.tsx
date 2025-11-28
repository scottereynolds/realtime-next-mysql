"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import BaseBox from "@/components/MUI/Layout/BaseBox";
import { BaseTextField } from "@/components/MUI/Inputs/BaseTextField";
import { BaseButton } from "@/components/MUI/Inputs/BaseButton";
import { BaseTypography } from "@/components/MUI/DataDisplay/BaseTypography";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Let NextAuth do a full redirect on success.
    // No `redirect: false`, no manual router.push.
    await signIn("credentials", {
      email,
      password,
      callbackUrl,
    });

    // We don't call setSubmitting(false) here because on success
    // the page will navigate away and this component will unmount.
    // On failure, NextAuth will redirect back with `?error=` by default.
  };

  const handleGithub = async () => {
    await signIn("github", { callbackUrl });
  };

  return (
    <BaseBox
      sx={{
        minHeight: "calc(100vh - 64px - 40px)", // header + footer approx
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
        <BaseTypography variant="h5">Sign in</BaseTypography>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
            {submitting ? "Signing in..." : "Sign in"}
          </BaseButton>
        </form>

        <BaseTypography
          variant="body2"
          sx={{ textAlign: "center", opacity: 0.7 }}
        >
          or
        </BaseTypography>

        <BaseButton onClick={handleGithub} fullWidth variant="outlined">
          Sign in with GitHub
        </BaseButton>
      </BaseBox>
    </BaseBox>
  );
}
