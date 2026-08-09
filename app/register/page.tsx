"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { PhoneNumberInput } from "@/components/phone-number-input";
import { useToast } from "@/components/toast-provider";
import { register } from "@/lib/api";
import { AuthShell } from "@/components/auth-shell";

export default function RegisterPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  
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
      pushToast("Akun berhasil dibuat. Silakan login.", "success");
      router.push("/login");
    } catch (err: any) {
      const message = err.message || "Gagal mendaftar. Coba lagi.";
      setErrorMessage(message);
      pushToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      badge="Webjoz Console"
      title="Mulai kelola bisnis Anda dengan mudah."
      description="Daftar untuk mulai membangun website bisnis yang profesional, cepat, dan siap iklan."
      cardEyebrow="Buat akun baru"
      cardTitle="Registrasi"
      cardDescription="Isi detail di bawah untuk mendaftarkan akun Anda."
      footer={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/login" className="font-medium text-primary hover:opacity-80">Sudah punya akun? Login</Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleRegister}>
        <div className="space-y-2">
          <Label htmlFor="reg-name">Nama Lengkap</Label>
          <Input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-email">Email</Label>
          <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-phone">Nomor WhatsApp</Label>
          <PhoneNumberInput id="reg-phone" value={phone} onChange={setPhone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-password">Password</Label>
          <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        {errorMessage && (
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-600">
            {errorMessage}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full h-12">
          {loading ? "Mendaftar..." : "Buat Akun"}
        </Button>
      </form>
    </AuthShell>
  );
}
