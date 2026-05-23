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

export function PhoneNumberInput({ id, label = "WhatsApp number", optional, value, onChange, error }: PhoneNumberInputProps) {
  const phone = splitPhoneNumber(value);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {optional ? <span className="text-muted-foreground">(optional)</span> : null}
      </Label>
      <div className="grid grid-cols-[9.5rem_minmax(0,1fr)] gap-2">
        <div className="min-w-0">
          <Select
            aria-label="Country code"
            value={phone.countryCode}
            onChange={(event) => onChange(buildPhoneNumber(event.target.value, phone.localNumber))}
            className="h-12 w-full text-base"
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.code} value={country.dialCode}>
                {country.flag} {country.dialCode}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-0">
          <Input
            id={id}
            type="tel"
            inputMode="tel"
            value={phone.localNumber}
            onChange={(event) => onChange(buildPhoneNumber(phone.countryCode, event.target.value))}
            placeholder="8123456789"
            error={error}
            className="h-12 text-base"
          />
        </div>
      </div>
    </div>
  );
}
