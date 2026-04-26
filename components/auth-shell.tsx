"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, SubtleStat } from "@/components/ui";

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  stats?: Array<{ label: string; value: string; helper?: string }>;
  cardEyebrow: string;
  cardTitle: string;
  cardDescription: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  badge,
  title,
  description,
  stats = [],
  cardEyebrow,
  cardTitle,
  cardDescription,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen px-6 py-10 lg:px-10 overflow-hidden">
      {/* Radial top glow — matches the home hero */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent -z-10 blur-3xl opacity-60" />

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Badge — same pulsing primary style as home hero */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Pleco logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
            <Badge
              variant="outline"
              className="w-fit px-4 py-1.5 border-primary/20 bg-primary/5 text-primary tracking-widest animate-pulse"
            >
              {badge}
            </Badge>
          </div>

          {/* Title — gradient clip-text, heavy weight, tight tracking, original sizes */}
          <h1 className="max-w-3xl text-5xl font-bold tracking-tighter lg:text-6xl bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent leading-[1.1]">
            {title}
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            {description}
          </p>

          {stats.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {stats.map((item) => (
                <SubtleStat key={`${item.label}-${item.value}`} label={item.label} value={item.value} helper={item.helper} />
              ))}
            </div>
          ) : null}
        </div>

        <Card className="bg-card/90 backdrop-blur animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
          <CardHeader className="border-b border-border/60 bg-gradient-to-br from-background via-background to-primary/8">
            <CardDescription>{cardEyebrow}</CardDescription>
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription>{cardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {children}
            <div className="mt-6 text-sm text-muted-foreground">
              {footer || <Link href="/" className="font-medium text-primary hover:opacity-80">Back to overview</Link>}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
