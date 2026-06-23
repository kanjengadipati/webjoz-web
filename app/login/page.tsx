"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MailIcon, WhatsAppIcon, InfoIcon, LockIcon } from "@/components/icons";
import { PhoneNumberInput, isValidPhoneNumber } from "@/components/phone-number-input";
import { Button, Checkbox, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { login, startPasswordless, verifyMagicLink, verifyOtp } from "@/lib/api";
import { persistAuthSession, useStoredEmail, useAuthToken, useAuthReady } from "@/lib/auth-store";
import { FieldErrors, getApiFieldErrors, getFormErrorMessage, hasFieldErrors } from "@/lib/form-errors";
import { AuthShell } from "@/components/auth-shell";

const PASSWORDLESS_FIELDS = ["email", "phone", "otp"] as const;
type PasswordlessField = (typeof PASSWORDLESS_FIELDS)[number];
type OTPChannel = "whatsapp" | "email";
type PasswordlessStep = "delivery" | "confirm" | "code" | "link";
type AuthMethod = "whatsapp" | "email" | "password";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginLoadingIndicator({ label = "Signing in" }: { label?: string }) {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const sequence = [1, 2, 3, 2];
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % sequence.length;
      setDotCount(sequence[index]);
    }, 350);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="inline-flex min-w-[112px] items-center justify-center gap-1.5" aria-live="polite">
      <span>{label}</span>
      <span className="inline-flex translate-y-0.5 gap-1" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className={dot < dotCount ? "size-1 rounded-full bg-primary-foreground transition-opacity duration-150 opacity-100" : "size-1 rounded-full bg-primary-foreground transition-opacity duration-150 opacity-20"}
          />
        ))}
      </span>
    </span>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const storedEmail = useStoredEmail();
  const authReady = useAuthReady();
  const token = useAuthToken();
  const [authMethod, setAuthMethod] = useState<AuthMethod>("whatsapp");
  const [otpChannel, setOtpChannel] = useState<OTPChannel>("whatsapp");
  const [passwordlessEmail, setPasswordlessEmail] = useState(storedEmail);
  const [passwordlessPhone, setPasswordlessPhone] = useState("");
  const [passwordEmail, setPasswordEmail] = useState(storedEmail);
  const [password, setPassword] = useState("");
  const [passwordlessStep, setPasswordlessStep] = useState<PasswordlessStep>("delivery");
  const [otp, setOtp] = useState("");
  const [trustedDevice, setTrustedDevice] = useState(true);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordlessFieldErrors, setPasswordlessFieldErrors] = useState<FieldErrors<PasswordlessField>>({});
  const handledExpiredToastRef = useRef(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // If already authenticated, skip the login page and go straight to the dashboard or resume wizard
  useEffect(() => {
    if (!authReady) return;
    if (!token) return;

    const params = new URLSearchParams(window.location.search);
    // Do not auto-redirect if we are in the middle of verifying a magic token
    if (params.get("magic_token")) return;

    const redirectParam = params.get("redirect");
    const pendingWizard = localStorage.getItem("webjoz_pending_wizard_data");

    if (redirectParam) {
      router.replace(redirectParam);
    } else if (pendingWizard) {
      router.replace("/create?action=save");
    } else {
      router.replace("/dashboard");
    }
  }, [authReady, token, router]);

  const passwordlessTarget = otpChannel === "email" ? passwordlessEmail.trim().toLowerCase() : passwordlessPhone.trim();

  function finishLogin(email: string, accessToken: string) {
    persistAuthSession(email, accessToken);
    const redirectParam = new URLSearchParams(window.location.search).get("redirect");
    const pendingWizard = localStorage.getItem("webjoz_pending_wizard_data");
    const savedRedirect = localStorage.getItem("webjoz_login_redirect");
    localStorage.removeItem("webjoz_login_redirect");
    if (redirectParam) {
      router.push(redirectParam);
    } else if (savedRedirect) {
      router.push(savedRedirect);
    } else if (pendingWizard) {
      router.push("/create?action=save");
    } else {
      router.push("/dashboard");
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "success") pushToast("Password updated. You can sign in now.", "success");
    if (params.get("passwordChanged") === "true") pushToast("Password changed. Please sign in again.", "success");
    const magicToken = params.get("magic_token");
    if (magicToken) {
      verifyMagicLink({
        token: magicToken,
        deviceName: navigator.userAgent.slice(0, 80),
        trustedDevice: true,
      })
        .then((response) => {
          finishLogin("", response.data.access_token);
          pushToast("Berhasil masuk. Selamat datang kembali.", "success");
        })
        .catch((error: unknown) => {
          setState("error");
          const message = getFormErrorMessage(error, "Link masuk tidak valid atau kedaluwarsa", {});
          setErrorMessage(message);

          const apiError = error as import("@/lib/api").ApiError;
          pushToast(message, "error", {
            aiDetails: apiError?.aiDetails,
            suggestions: apiError?.suggestions,
          });
        });
      params.delete("magic_token");
      const nextSearch = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`);
    }
    if (params.get("expired") === "true" && !handledExpiredToastRef.current) {
      handledExpiredToastRef.current = true;
      pushToast("Sesi Kedaluwarsa", "error", {
        message: "Sesi Anda telah kedaluwarsa. Silakan masuk kembali untuk melanjutkan.",
        actionLabel: "Dismiss",
        autoClose: false,
        position: "top-center",
      });
      params.delete("expired");
      const nextSearch = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`);
    }
  }, [pushToast, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  function validatePasswordlessTarget() {
    const target = passwordlessTarget;
    if (otpChannel === "email" && (!target || !EMAIL_PATTERN.test(target))) {
      const nextErrors = { email: "Masukkan alamat email yang valid." };
      setPasswordlessStep("delivery");
      setState("error");
      setPasswordlessFieldErrors(nextErrors);
      setErrorMessage("Perbaiki field yang ditandai.");
      return "";
    }
    if (otpChannel === "whatsapp" && !isValidPhoneNumber(target)) {
      const nextErrors = { phone: "Masukkan nomor WhatsApp yang valid." };
      setPasswordlessStep("delivery");
      setState("error");
      setPasswordlessFieldErrors(nextErrors);
      setErrorMessage("Perbaiki field yang ditandai.");
      return "";
    }
    return target;
  }

  function handlePasswordlessError(error: unknown, fallback: string) {
    setState("error");
    const nextErrors = getApiFieldErrors(error, PASSWORDLESS_FIELDS);
    setPasswordlessFieldErrors(nextErrors);
    const message = getFormErrorMessage(error, fallback, nextErrors);
    setErrorMessage(message);

    const apiError = error as import("@/lib/api").ApiError;
    pushToast(message, "error", {
      aiDetails: apiError?.aiDetails,
      suggestions: apiError?.suggestions,
    });
  }

  function handlePasswordlessCheck(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const target = validatePasswordlessTarget();
    if (!target) return;
    if (otpChannel === "email") setPasswordlessEmail(target);
    if (otpChannel === "whatsapp") setPasswordlessPhone(target);
    sendPasswordlessCode();
  }

  function sendPasswordlessCode() {
    const target = passwordlessTarget;
    if (!target) return;
    setState("loading");
    setErrorMessage("");
    setPasswordlessFieldErrors({});
    startPasswordless(otpChannel, target)
      .then((response) => {
        const nextStep = response.data.next_step;
        if (nextStep === "magic_link" && response.data.magic_link_url) {
          const currentRedirect = new URLSearchParams(window.location.search).get("redirect");
          const hasPendingWizard = !!localStorage.getItem("webjoz_pending_wizard_data");
          if (currentRedirect) {
            localStorage.setItem("webjoz_login_redirect", currentRedirect);
          } else if (hasPendingWizard) {
            localStorage.setItem("webjoz_login_redirect", "/create?action=save");
          }
          window.location.href = response.data.magic_link_url;
          return;
        }
        setPasswordlessStep(nextStep === "magic_link" ? "link" : "code");
        setResendCooldown(30);
        pushToast("Kode terkirim. Silakan cek pesan Anda.", "success");
      })
      .catch((error: unknown) => handlePasswordlessError(error, "Gagal mengirim kode. Coba lagi."))
      .finally(() => setState((current) => (current === "loading" ? "idle" : current)));
  }

  function handleOTPVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      const nextErrors = { otp: "Masukkan kode OTP 6 digit." };
      setState("error");
      setPasswordlessFieldErrors(nextErrors);
      setErrorMessage("Perbaiki field yang ditandai.");
      return;
    }

    setState("loading");
    setErrorMessage("");
    setPasswordlessFieldErrors({});
    const target = passwordlessTarget;
    verifyOtp({
      channel: otpChannel,
      target,
      otp,
      deviceName: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 80) : "browser",
      trustedDevice,
    })
      .then((response) => {
        finishLogin(otpChannel === "email" ? target : "", response.data.access_token);
        pushToast("Kode OTP terverifikasi. Selamat datang kembali.", "success");
      })
      .catch((error: unknown) => handlePasswordlessError(error, "Kode OTP tidak valid atau kedaluwarsa"));
  }

  function handlePasswordLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = passwordEmail.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email) || password.length < 1) {
      setState("error");
      setErrorMessage("Masukkan email dan password yang valid.");
      return;
    }

    setState("loading");
    setErrorMessage("");
    login(email, password)
      .then((response) => {
        finishLogin(email, response.data.access_token);
        pushToast("Berhasil masuk. Selamat datang kembali.", "success");
      })
      .catch((error: unknown) => {
        setState("error");
        const message = getFormErrorMessage(error, "Email atau password salah.", {});
        setErrorMessage(message);
        pushToast(message, "error");
      })
      .finally(() => setState((current) => (current === "loading" ? "idle" : current)));
  }

  function switchAuthMethod(method: AuthMethod) {
    setAuthMethod(method);
    if (method === "whatsapp" || method === "email") setOtpChannel(method);
    setPasswordlessStep("delivery");
    setOtp("");
    setErrorMessage("");
    setPasswordlessFieldErrors({});
    setState("idle");
  }

  const formContent = (
    <div className="min-h-[18rem]">
      {passwordlessStep === "delivery" ? (
        <div className="space-y-5">
          {authMethod === "whatsapp" ? (
            <>
              <form className="space-y-4" onSubmit={handlePasswordlessCheck}>
                <PhoneNumberInput
                  id="passwordless-phone"
                  value={passwordlessPhone}
                  onChange={(value) => {
                    setPasswordlessPhone(value);
                    setPasswordlessFieldErrors((current) => ({ ...current, phone: undefined }));
                    setOtp("");
                    setErrorMessage("");
                  }}
                  error={passwordlessFieldErrors.phone}
                />

                <div className="flex items-start gap-2.5 text-xs text-muted-foreground/80 leading-relaxed px-0.5">
                  <InfoIcon className="size-4 shrink-0 mt-0.5 text-muted-foreground/60" />
                  <span>Link atau kode OTP dikirim via WhatsApp. Nomor baru? Akun otomatis dibuat.</span>
                </div>

                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-sm transition disabled:opacity-50 shadow-sm shadow-[#25D366]/20"
                >
                  <WhatsAppIcon size="md" className="fill-current text-white" />
                  {state === "loading" ? (
                    <LoginLoadingIndicator label="Mengirim kode..." />
                  ) : (
                    <>Kirim Kode OTP via WhatsApp</>
                  )}
                </button>
              </form>

              <div className="relative flex items-center my-5">
                <div className="flex-grow border-t border-border/80"></div>
                <span className="flex-shrink mx-4 text-xs text-muted-foreground/70 font-medium">atau lanjutkan dengan</span>
                <div className="flex-grow border-t border-border/80"></div>
              </div>

              <SocialAuthButtons
                mode="login"
                layout="grid"
                showSeparator={false}
                onLoadingStateChange={(loading) => {
                  setState(loading ? "loading" : "idle");
                }}
                onErrorMessageChange={(message) => {
                  if (message) setState("error");
                  setErrorMessage(message);
                }}
              />
            </>
          ) : authMethod === "email" ? (
            <>
              <SocialAuthButtons
                mode="login"
                layout="grid"
                showSeparator={false}
                onLoadingStateChange={(loading) => {
                  setState(loading ? "loading" : "idle");
                }}
                onErrorMessageChange={(message) => {
                  if (message) setState("error");
                  setErrorMessage(message);
                }}
              />

              <div className="relative flex items-center my-5">
                <div className="flex-grow border-t border-border/80"></div>
                <span className="flex-shrink mx-4 text-xs text-muted-foreground/70 font-medium">atau masuk dengan email</span>
                <div className="flex-grow border-t border-border/80"></div>
              </div>

              <form className="space-y-4" onSubmit={handlePasswordlessCheck}>
                <div className="space-y-2">
                  <Label htmlFor="passwordless-email" className="sr-only">Alamat email</Label>
                  <Input
                    id="passwordless-email"
                    type="email"
                    value={passwordlessEmail}
                    onChange={(event) => {
                      setPasswordlessEmail(event.target.value);
                      setPasswordlessFieldErrors((current) => ({ ...current, email: undefined }));
                      setOtp("");
                      setErrorMessage("");
                    }}
                    placeholder="Alamat email kamu"
                    className="h-11 text-base placeholder:text-muted-foreground/60 bg-background"
                    error={passwordlessFieldErrors.email}
                  />
                </div>

                <div className="flex items-start gap-2.5 text-xs text-muted-foreground/80 leading-relaxed px-0.5">
                  <InfoIcon className="size-4 shrink-0 mt-0.5 text-muted-foreground/60" />
                  <span>Link atau kode OTP dikirim via email. Email baru? Akun otomatis dibuat.</span>
                </div>

                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-lg border border-border bg-background hover:bg-muted font-semibold text-foreground text-sm transition disabled:opacity-50 shadow-sm"
                >
                  {state === "loading" ? (
                    <LoginLoadingIndicator label="Mengirim kode..." />
                  ) : (
                    <>Kirim Kode OTP</>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-border/70 bg-background/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <LockIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Login dengan password</p>
                    <p className="text-xs text-muted-foreground">Gunakan email dan password akun kamu.</p>
                  </div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handlePasswordLogin}>
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={passwordEmail}
                    onChange={(event) => {
                      setPasswordEmail(event.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="nama@email.com"
                    className="h-11 text-base bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="login-password">Password</Label>
                    <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:opacity-80">
                      Lupa password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setErrorMessage("");
                      }}
                      placeholder="Password akun"
                      className="h-11 text-base bg-background pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={state === "loading"} className="h-12 w-full rounded-lg">
                  {state === "loading" ? <LoginLoadingIndicator label="Login" /> : "Login dengan password"}
                </Button>
              </form>
            </>
          )}
        </div>
      ) : null}

      {passwordlessStep === "code" ? (
        <form className="space-y-4" onSubmit={handleOTPVerify}>
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
            Kode dikirim via {otpChannel === "whatsapp" ? "WhatsApp" : "email"} ke{" "}
            <span className="break-all font-semibold">
              {otpChannel === "whatsapp" ? passwordlessPhone : passwordlessEmail}
            </span>
            . Berlaku 5 menit.
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp-code">Kode OTP</Label>
            <Input
              id="otp-code"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                setPasswordlessFieldErrors((current) => ({ ...current, otp: undefined }));
              }}
              placeholder="000000"
              className="h-14 text-center text-2xl tracking-[0.4em] font-bold"
              autoFocus
              error={passwordlessFieldErrors.otp}
            />
          </div>
          <label className="flex items-center gap-3 text-sm text-muted-foreground select-none cursor-pointer">
            <Checkbox checked={trustedDevice} onChange={(event) => setTrustedDevice(event.target.checked)} />
            Percayai perangkat ini
          </label>
          <div className="grid gap-3 grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPasswordlessStep("delivery");
                setOtp("");
                setErrorMessage("");
                setState("idle");
              }}
            >
              Kembali
            </Button>
            <Button type="submit" disabled={state === "loading"} className="w-full">
              {state === "loading" ? <LoginLoadingIndicator label="Memverifikasi" /> : "Verifikasi OTP"}
            </Button>
          </div>
          <button
            type="button"
            className="w-full text-center text-sm font-medium text-primary hover:opacity-80 transition pt-2 disabled:opacity-40"
            disabled={state === "loading" || resendCooldown > 0}
            onClick={() => {
              handlePasswordlessCheck();
              setResendCooldown(30);
            }}
          >
            {resendCooldown > 0
              ? `Kirim ulang (${resendCooldown}s)`
              : "Tidak menerima kode? Kirim ulang"}
          </button>
        </form>
      ) : null}

      {passwordlessStep === "link" ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground leading-relaxed">
            Link masuk telah dikirim. Buka link tersebut di perangkat ini untuk melanjutkan.
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setPasswordlessStep("delivery");
              setErrorMessage("");
              setState("idle");
            }}
          >
            Kembali
          </Button>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
          {errorMessage}
        </div>
      ) : null}

      {passwordlessStep === "delivery" && (
        <div className="mt-5 space-y-2.5 border-t border-border/50 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">Opsi lain</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { method: "whatsapp" as const, icon: <WhatsAppIcon size="sm" className="text-[#25D366]" />, label: "WhatsApp" },
              { method: "email" as const, icon: <MailIcon size="sm" />, label: "Email OTP" },
              { method: "password" as const, icon: <LockIcon size="sm" />, label: "Password" },
            ]
              .filter(({ method }) => method !== authMethod)
              .map(({ method, icon, label }) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => switchAuthMethod(method)}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary/50 hover:bg-primary/5"
                >
                  {icon}
                  {label}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AuthShell
      badge="Webjoz Console"
      title="Lanjutkan kelola website bisnis Anda."
      description="Login untuk mengelola website, edit konten, lihat analytics, dan pantau performa — semua dari satu dashboard."
      stats={[
        { label: "AI Builder", value: "Chat-Based", helper: "Cukup chat dengan AI, website langsung jadi." },
        { label: "Mobile-First", value: "Optimized", helper: "Semua template dioptimalkan untuk tampilan mobile dan siap iklan." },
      ]}
      cardEyebrow="Login untuk melanjutkan"
      cardTitle="Login"
      cardDescription="Gunakan WhatsApp, email OTP, atau password untuk mengakses dashboard."
      footer={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/" className="font-medium text-primary hover:opacity-80">Beranda</Link>
          <Link href="/register" className="font-medium text-primary hover:opacity-80">Buat akun</Link>
          <Link href="/forgot-password" className="font-medium text-primary hover:opacity-80">Lupa password</Link>
        </div>
      }
    >
      {formContent}
    </AuthShell>
  );
}
