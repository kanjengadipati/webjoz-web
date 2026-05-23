"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { PhoneNumberInput, isValidPhoneNumber } from "@/components/phone-number-input";
import { Button, Card, CardContent, CardHeader, EmptyState, Input, Label, SectionTitle } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { changePassword, fetchProfile, updateProfile } from "@/lib/api";
import { clearAuthSession, useAuthToken } from "@/lib/auth-store";
import type { Profile } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const token = useAuthToken();
  const { pushToast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const loadProfile = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetchProfile(token);
      setProfile(response.data);
      setName(response.data.name);
      setPhoneNumber(response.data.phone_number || "");
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Failed to load profile", "error");
    }
  }, [pushToast, token]);

  useEffect(() => {
    if (!token) return;
    const timeout = window.setTimeout(() => {
      void loadProfile();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadProfile, token]);

  async function handleProfileUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      setPhoneError("Use international format, like +628123456789.");
      return;
    }
    setPhoneError("");
    try {
      await updateProfile(token, name, phoneNumber);
      pushToast("Profile updated.", "success");
      await loadProfile();
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Failed to update profile", "error");
    }
  }

  async function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    try {
      await changePassword(token, currentPassword, newPassword);
      clearAuthSession();
      setCurrentPassword("");
      setNewPassword("");
      pushToast("Password changed. Please sign in again.", "success");
      router.push("/login?passwordChanged=true");
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Failed to change password", "error");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle eyebrow="Profile" title="Profile Settings" />
        </CardHeader>
        <CardContent className="pt-6">
        {profile ? (
          <form className="space-y-4" onSubmit={handleProfileUpdate}>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email} readOnly className="bg-muted/60 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <PhoneNumberInput
              id="settings-phone-number"
              optional
              value={phoneNumber}
              onChange={(value) => {
                setPhoneNumber(value);
                setPhoneError("");
              }}
              error={phoneError}
            />
            <Button type="submit">Save Profile</Button>
          </form>
        ) : (
          <EmptyState text="Profile data will appear here after authentication." />
        )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle eyebrow="Security" title="Change Password" />
        </CardHeader>
        <CardContent className="pt-6">
        <form className="space-y-4" onSubmit={handlePasswordChange}>
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </div>
          <Button type="submit" variant="secondary">
            Update Password
          </Button>
        </form>
        </CardContent>
      </Card>
    </div>
  );
}
