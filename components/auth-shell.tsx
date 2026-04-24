"use client";

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
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <Badge variant="secondary" className="w-fit">{badge}</Badge>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight lg:text-6xl">
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

        <Card className="bg-card/90 backdrop-blur">
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
