"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { PhoneNumberInput } from "@/components/phone-number-input";
import { useToast } from "@/components/toast-provider";
import { register } from "@/lib/api";
import { AuthShell } from "@/components/auth-shell";
import { useI18n } from "@/lib/i18n/context";

export default function RegisterPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const { t } = useI18n();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await register(name, email, phone, password);
      pushToast(t("auth.registerSuccess"), "success");
      router.push("/login");
    } catch (err: any) {
      const message = err.message || t("auth.errorRegisterFailed");
      setErrorMessage(message);
      pushToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      badge={t("auth.registerBadge")}
      title={t("auth.registerTitle")}
      description={t("auth.registerDesc")}
      cardEyebrow={t("auth.registerCardEyebrow")}
      cardTitle={t("auth.registerCardTitle")}
      cardDescription={t("auth.registerCardDesc")}
      footer={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/login" className="font-medium text-primary hover:opacity-80">{t("auth.registerFooterLogin")}</Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleRegister}>
        <div className="space-y-2">
          <Label htmlFor="reg-name">{t("auth.registerFullName")}</Label>
          <Input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-email">{t("auth.registerEmail")}</Label>
          <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-phone">{t("auth.registerWhatsapp")}</Label>
          <PhoneNumberInput id="reg-phone" value={phone} onChange={setPhone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-password">{t("auth.registerPassword")}</Label>
          <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        {errorMessage && (
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-600">
            {errorMessage}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full h-12">
          {loading ? t("auth.registerLoading") : t("auth.registerSubmit")}
        </Button>
      </form>
    </AuthShell>
  );
}
