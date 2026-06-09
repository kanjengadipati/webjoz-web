"use client";

import { Input, Label, Select } from "@/components/ui";

const COUNTRY_CODES = [
  { code: "ID", flag: "🇮🇩", name: "Indonesia", dialCode: "+62" },
  { code: "MY", flag: "🇲🇾", name: "Malaysia", dialCode: "+60" },
  { code: "SG", flag: "🇸🇬", name: "Singapore", dialCode: "+65" },
  { code: "TH", flag: "🇹🇭", name: "Thailand", dialCode: "+66" },
  { code: "PH", flag: "🇵🇭", name: "Philippines", dialCode: "+63" },
  { code: "VN", flag: "🇻🇳", name: "Vietnam", dialCode: "+84" },
  { code: "US", flag: "🇺🇸", name: "United States", dialCode: "+1" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom", dialCode: "+44" },
  { code: "AU", flag: "🇦🇺", name: "Australia", dialCode: "+61" },
  { code: "IN", flag: "🇮🇳", name: "India", dialCode: "+91" },
] as const;

const PHONE_PATTERN = /^\+[1-9]\d{7,14}$/;
const DEFAULT_DIAL_CODE = "+62";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function splitPhoneNumber(phoneNumber: string) {
  if (!phoneNumber) return { countryCode: DEFAULT_DIAL_CODE, localNumber: "" };
  const match = COUNTRY_CODES.find((country) => phoneNumber.startsWith(country.dialCode));
  if (!match) return { countryCode: DEFAULT_DIAL_CODE, localNumber: digitsOnly(phoneNumber) };
  return {
    countryCode: match.dialCode,
    localNumber: digitsOnly(phoneNumber.slice(match.dialCode.length)),
  };
}

export function buildPhoneNumber(dialCode: string, localNumber: string) {
  const normalizedLocal = digitsOnly(localNumber).replace(/^0+/, "");
  return normalizedLocal ? `${dialCode}${normalizedLocal}` : "";
}

export function isValidPhoneNumber(phoneNumber: string) {
  return PHONE_PATTERN.test(phoneNumber);
}

type PhoneNumberInputProps = {
  id: string;
  label?: string;
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function PhoneNumberInput({ id, label, optional, value, onChange, error }: PhoneNumberInputProps) {
  const phone = splitPhoneNumber(value);

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id}>
          {label} {optional ? <span className="text-muted-foreground">(optional)</span> : null}
        </Label>
      )}
      <div className={`flex items-center rounded-lg border bg-background px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/80 transition ${error ? "border-rose-500" : "border-border"}`}>
        <select
          aria-label="Country code"
          value={phone.countryCode}
          onChange={(event) => onChange(buildPhoneNumber(event.target.value, phone.localNumber))}
          className="bg-transparent border-none outline-none focus:ring-0 pr-2 py-1 text-base cursor-pointer font-medium"
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.dialCode}>
              {country.flag} {country.dialCode}
            </option>
          ))}
        </select>
        <div className="h-6 w-px bg-border/80 mx-2" />
        <input
          id={id}
          type="tel"
          inputMode="tel"
          value={phone.localNumber}
          onChange={(event) => onChange(buildPhoneNumber(phone.countryCode, event.target.value))}
          placeholder="Nomor WhatsApp kamu"
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 py-1 text-base placeholder:text-muted-foreground/60"
        />
      </div>
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}
