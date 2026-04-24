import Link from "next/link";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, SubtleStat } from "@/components/ui";

const features = [
  {
    title: "Security telemetry",
    body: "Auth spikes, failed logins, active sessions, and suspicious IP activity in one view.",
  },
  {
    title: "Audit exploration",
    body: "Filter and inspect audit rows so backend behavior reads like a product feed.",
  },
  {
    title: "AI investigation flow",
    body: "Turn recent incidents into a summary, suspicious signals, and recommendations.",
  },
  {
    title: "Operator controls",
    body: "Manage users, revoke sessions, and adjust settings from the same workspace.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-8">
        <section className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden border-border/70 bg-card/90">
            <CardHeader className="space-y-8 bg-gradient-to-br from-primary/12 via-background to-background p-8 lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge variant="secondary" className="w-fit">Go API Starterkit Demo</Badge>
                <div className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-muted-foreground">
                  Next.js + Tailwind + shadcn/ui patterns
                </div>
              </div>
              <div className="space-y-4">
                <CardTitle className="max-w-4xl text-5xl leading-tight lg:text-6xl xl:text-7xl">
                  A security workspace that makes your Go backend feel launch-ready.
                </CardTitle>
                <CardDescription className="max-w-3xl text-base leading-8 lg:text-lg">
                  This landing page frames the product story clearly, while the dashboard turns auth, sessions, logs, and AI investigation into a cohesive admin experience instead of a loose API demo.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/login"><Button size="lg">Open Demo Dashboard</Button></Link>
                <a href="http://localhost:8080/docs" target="_blank" rel="noreferrer"><Button variant="outline" size="lg">View API Docs</Button></a>
              </div>
              <div className="grid gap-3 rounded-3xl border border-border/70 bg-background/55 p-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-primary/12 via-background to-background p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Live Admin Preview</div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Failed Logins</div>
                        <div className="mt-1 text-2xl font-semibold">18</div>
                      </div>
                      <Badge className="border-rose-500/20 bg-rose-500/15 text-rose-700 dark:text-rose-300">High</Badge>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Sessions</div>
                        <div className="mt-1 text-xl font-semibold">42 active</div>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Investigations</div>
                        <div className="mt-1 text-xl font-semibold">6 saved</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3">
                  <SubtleStat label="Use Case" value="Demo-ready" helper="A better first impression for clients, founders, and recruiters." />
                  <SubtleStat label="Admin Story" value="End-to-end" helper="Landing, auth, metrics, logs, sessions, and investigation in one flow." />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <SubtleStat label="Auth modules" value="6+" helper="Login, profile, sessions, users, settings, and AI investigation." />
                <SubtleStat label="Operator focus" value="Live" helper="Designed for quick product demos and internal admin workflows." />
                <SubtleStat label="Backend feel" value="Productized" helper="Polished cards, clearer hierarchy, and action-oriented surfaces." />
              </div>
            </CardHeader>
          </Card>

          <div className="grid content-start gap-4 self-start md:grid-cols-2 lg:grid-cols-1">
            {features.map((item, index) => (
              <Card key={item.title} className="bg-card/85">
                <CardContent className="flex min-h-40 items-center gap-4 p-5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                    0{index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold leading-tight">{item.title}</div>
                    <div className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/60">
              <CardDescription>Why it lands better</CardDescription>
              <CardTitle className="text-3xl">Built for demos, not just screenshots</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6">
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                <div className="text-sm font-semibold">Clear product story</div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  A stronger landing view gives context before users authenticate, then hands them into an interface that feels intentionally designed.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                <div className="text-sm font-semibold">Consistent interaction patterns</div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Shared buttons, inputs, badges, and cards make every route feel like part of the same admin suite.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/60 bg-gradient-to-br from-accent/40 via-background to-background">
              <CardDescription>Preview</CardDescription>
              <CardTitle className="text-3xl">What the dashboard emphasizes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
              <SubtleStat label="Overview" value="Metrics + profile" helper="Hero stats, operator summary, and event recency." />
              <SubtleStat label="Logs" value="Live filters" helper="Fast scanning with expandable details." />
              <SubtleStat label="Sessions" value="Revoke controls" helper="Clear current-vs-other session handling." />
              <SubtleStat label="Investigate" value="AI summary" helper="Risk framing, timelines, and recommendations." />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
