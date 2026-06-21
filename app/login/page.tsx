"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MailIcon, WhatsAppIcon, InfoIcon, LockIcon } from "@/components/icons";
import { PhoneNumberInput, isValidPhoneNumber } from "@/components/phone-number-input";
import { Button, Checkbox, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { checkPasswordlessIdentity, login, startPasswordless, verifyMagicLink, verifyOtp } from "@/lib/api";
import { persistAuthSession, useStoredEmail, useAuthToken, useAuthReady } from "@/lib/auth-store";
import { FieldErrors, getApiFieldErrors, getFormErrorMessage, hasFieldErrors } from "@/lib/form-errors";

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
  const [isDeviceTrusted, setIsDeviceTrusted] = useState(false);

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
    // Also check a saved redirect key that survives cross-URL navigations (e.g. magic link)
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
          pushToast("Login successful. Welcome back.", "success");
        })
        .catch((error: unknown) => {
          setState("error");
          const message = getFormErrorMessage(error, "Invalid or expired magic link", {});
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
      pushToast("Session Expired", "error", {
        message: "Your session has expired. Please sign in again to continue.",
        actionLabel: "Dismiss",
        autoClose: false,
        position: "top-center",
      });
      params.delete("expired");
      const nextSearch = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`);
    }
  }, [pushToast, router]);

  function validatePasswordlessTarget() {
    const target = passwordlessTarget;
    if (otpChannel === "email" && (!target || !EMAIL_PATTERN.test(target))) {
      const nextErrors = { email: "Enter a valid email address." };
      setPasswordlessStep("delivery");
      setState("error");
      setPasswordlessFieldErrors(nextErrors);
      setErrorMessage("Please fix the highlighted fields.");
      pushToast("Please fix the highlighted fields.", "error");
      return "";
    }
    if (otpChannel === "whatsapp" && !isValidPhoneNumber(target)) {
      const nextErrors = { phone: "Enter a valid WhatsApp number." };
      setPasswordlessStep("delivery");
      setState("error");
      setPasswordlessFieldErrors(nextErrors);
      setErrorMessage("Please fix the highlighted fields.");
      pushToast("Please fix the highlighted fields.", "error");
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

  function handlePasswordlessCheck(event: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const target = validatePasswordlessTarget();
    if (!target) return;

    if (otpChannel === "email") setPasswordlessEmail(target);
    if (otpChannel === "whatsapp") setPasswordlessPhone(target);
    setState("loading");
    setErrorMessage("");
    setPasswordlessFieldErrors({});
    checkPasswordlessIdentity(otpChannel, target)
      .then((response) => {
        setIsDeviceTrusted(!!response.data?.is_trusted_device);
        setPasswordlessStep("confirm");
      })
      .catch((error: unknown) => handlePasswordlessError(error, "Unable to continue passwordless login"))
      .finally(() => setState((current) => (current === "loading" ? "idle" : current)));
  }

  function handlePasswordlessStart(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const target = validatePasswordlessTarget();
    if (!target) return;

    setState("loading");
    setErrorMessage("");
    setPasswordlessFieldErrors({});
      startPasswordless(otpChannel, target)
        .then((response) => {
          const nextStep = response.data.next_step;
          // If backend provides a direct magic link URL, navigate to it immediately
          if (nextStep === "magic_link" && response.data.magic_link_url) {
            // Persist the intended redirect before navigating away — the magic link URL
            // won't carry our ?redirect query param, so we save it here and read it
            // back in finishLogin() after the token is verified.
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
          pushToast("Check your messages.", "success");
        })
      .catch((error: unknown) => handlePasswordlessError(error, "Unable to continue passwordless login"))
      .finally(() => setState((current) => (current === "loading" ? "idle" : current)));
  }

  function handleOTPVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      const nextErrors = { otp: "Enter the 6-digit OTP code." };
      setState("error");
      setPasswordlessFieldErrors(nextErrors);
      setErrorMessage("Please fix the highlighted fields.");
      pushToast("Please fix the highlighted fields.", "error");
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
        pushToast("OTP verified. Welcome back.", "success");
      })
      .catch((error: unknown) => handlePasswordlessError(error, "Invalid or expired OTP"));
  }

  function handlePasswordLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = passwordEmail.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email) || password.length < 1) {
      setState("error");
      setErrorMessage("Masukkan email dan password yang valid.");
      pushToast("Masukkan email dan password yang valid.", "error");
      return;
    }

    setState("loading");
    setErrorMessage("");
    login(email, password)
      .then((response) => {
        finishLogin(email, response.data.access_token);
        pushToast("Login berhasil. Selamat datang kembali.", "success");
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

  const handleWhatsAppButtonClick = () => {
    if (!passwordlessPhone.trim()) {
      const inputEl = document.getElementById("passwordless-phone");
      if (inputEl) {
        inputEl.focus();
      }
      pushToast("Silakan masukkan nomor WhatsApp Anda di bawah.", "info");
    } else {
      handlePasswordlessStart();
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
      {/* Radial top glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent -z-10 blur-3xl opacity-60" />

      <div className="w-full max-w-[420px] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="space-y-2 text-left">
          <p className="text-sm font-medium text-muted-foreground/85">
            Simpan website kamu — masuk dulu sebentar
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Masuk
          </h1>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm relative">
          {passwordlessStep === "delivery" ? (
            <div className="space-y-5">
              {authMethod === "whatsapp" ? (
                <>
                  {/* WhatsApp Big Green Button */}
                  <button
                    type="button"
                    onClick={handleWhatsAppButtonClick}
                    disabled={state === "loading"}
                    className="w-full h-11 flex items-center justify-center gap-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-semibold transition cursor-pointer shadow-sm shadow-[#25D366]/20 disabled:opacity-50"
                  >
                    <WhatsAppIcon size="md" className="fill-current text-white" />
                    Masuk dengan WhatsApp
                  </button>

                  {/* Social Buttons */}
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

                  {/* Separator */}
                  <div className="relative flex items-center my-5">
                    <div className="flex-grow border-t border-border/80"></div>
                    <span className="flex-shrink mx-4 text-xs text-muted-foreground/70 font-medium">atau masuk dengan nomor</span>
                    <div className="flex-grow border-t border-border/80"></div>
                  </div>

                  {/* WhatsApp Form */}
                  <form className="space-y-4" onSubmit={handlePasswordlessStart}>
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
                      className="w-full h-12 flex items-center justify-center gap-2 rounded-lg border border-border bg-background hover:bg-muted font-semibold text-foreground text-sm transition disabled:opacity-50 shadow-sm"
                    >
                      {state === "loading" ? (
                        <LoginLoadingIndicator label="Memeriksa" />
                      ) : (
                        <>
                          Lanjutkan
                          <span className="text-base" aria-hidden="true">&rarr;</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : authMethod === "email" ? (
                <>
                  {/* Social Buttons */}
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

                  {/* Separator */}
                  <div className="relative flex items-center my-5">
                    <div className="flex-grow border-t border-border/80"></div>
                    <span className="flex-shrink mx-4 text-xs text-muted-foreground/70 font-medium">atau masuk dengan email</span>
                    <div className="flex-grow border-t border-border/80"></div>
                  </div>

                  {/* Email Form */}
                  <form className="space-y-4" onSubmit={handlePasswordlessStart}>
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
                        <LoginLoadingIndicator label="Memeriksa" />
                      ) : (
                        <>
                          Lanjutkan
                          <span className="text-base" aria-hidden="true">&rarr;</span>
                        </>
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
                        <p className="text-sm font-bold text-foreground">Masuk dengan password</p>
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
                      <Input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          setErrorMessage("");
                        }}
                        placeholder="Password akun"
                        className="h-11 text-base bg-background"
                      />
                    </div>
                    <Button type="submit" disabled={state === "loading"} className="h-12 w-full rounded-lg">
                      {state === "loading" ? <LoginLoadingIndicator label="Masuk" /> : "Masuk dengan password"}
                    </Button>
                  </form>
                </>
              )}
            </div>
          ) : null}

          {passwordlessStep === "confirm" ? (
            <form className="space-y-4" onSubmit={handlePasswordlessStart}>
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
                {isDeviceTrusted ? (
                  <>
                    Kami akan mengirimkan link masuk ke{" "}
                    <span className="break-all font-semibold">{passwordlessTarget}</span>.
                  </>
                ) : (
                  <>
                    Kami akan mengirim kode masuk ke{" "}
                    <span className="break-all font-semibold">{passwordlessTarget}</span>.
                  </>
                )}
              </div>
              <div className="grid gap-3 grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPasswordlessStep("delivery");
                    setErrorMessage("");
                    setState("idle");
                    setIsDeviceTrusted(false);
                  }}
                >
                  Kembali
                </Button>
                <Button type="submit" disabled={state === "loading"}>
                  {state === "loading" ? (
                    <LoginLoadingIndicator label="Mengirim" />
                  ) : isDeviceTrusted ? (
                    "Kirim link"
                  ) : (
                    "Kirim kode"
                  )}
                </Button>
              </div>
            </form>
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
                className="w-full text-center text-sm font-medium text-primary hover:opacity-80 transition pt-2"
                disabled={state === "loading"}
                onClick={() => handlePasswordlessStart()}
              >
                Tidak menerima kode? Kirim ulang
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
        </div>

        {/* Footer links: Opsi lain & Kembali */}
        <div className="space-y-4 text-left px-2">
          {passwordlessStep === "delivery" && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Opsi lain</p>
              <div className="grid grid-cols-3 gap-2">
                {authMethod !== "whatsapp" && (
                  <button
                    type="button"
                    onClick={() => switchAuthMethod("whatsapp")}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-card/60 px-3 py-2.5 text-xs font-semibold text-foreground transition hover:border-primary/50 hover:bg-primary/5"
                  >
                    <WhatsAppIcon size="sm" className="text-[#25D366]" />
                    WhatsApp
                  </button>
                )}
                {authMethod !== "email" && (
                  <button
                    type="button"
                    onClick={() => switchAuthMethod("email")}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-card/60 px-3 py-2.5 text-xs font-semibold text-foreground transition hover:border-primary/50 hover:bg-primary/5"
                  >
                    <MailIcon size="sm" />
                    Email OTP
                  </button>
                )}
                {authMethod !== "password" && (
                  <button
                    type="button"
                    onClick={() => switchAuthMethod("password")}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-card/60 px-3 py-2.5 text-xs font-semibold text-foreground transition hover:border-primary/50 hover:bg-primary/5"
                  >
                    <LockIcon size="sm" />
                    Password
                  </button>
                )}
              </div>
            </div>
          )}

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              <span aria-hidden="true">&larr;</span>
              Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
