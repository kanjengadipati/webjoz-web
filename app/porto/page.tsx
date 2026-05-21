import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, SubtleStat, buttonClassName } from "@/components/ui";

export const metadata: Metadata = {
  title: "Heriyadi - Senior Frontend Engineer",
  description:
    "Portfolio and CV landing page for Heriyadi, Senior Frontend Engineer specializing in React, TypeScript, Golang, Flutter, and scalable frontend architecture.",
  openGraph: {
    title: "Heriyadi - Senior Frontend Engineer",
    description:
      "Portfolio and CV landing page for Heriyadi, Senior Frontend Engineer specializing in React, TypeScript, Golang, Flutter, and scalable frontend architecture.",
    siteName: "Heriyadi Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heriyadi - Senior Frontend Engineer",
    description:
      "Portfolio and CV landing page for Heriyadi, Senior Frontend Engineer specializing in React, TypeScript, Golang, Flutter, and scalable frontend architecture.",
  },
};

const experience = [
  {
    role: "Senior Fullstack and Frontend Engineer",
    company: "Grab",
    period: "2018 - 2025",
    tone: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    points: [
      "Delivered production features for merchant management and onboarding systems used by millions of merchants.",
      "Designed merchant onboarding web-mobile platforms enabling merchants to register and manage business accounts.",
      "Reduced page load time by up to 40% and improved platform stability through continuous refactoring.",
    ],
  },
  {
    role: "Founder & Developer",
    company: "Own Company",
    period: "2025 - Present",
    tone: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    points: [
      "Building innovative products focused on solving real-world problems with modern web technologies.",
    ],
  },
  {
    role: "Software Engineer",
    company: "PT Kudo Teknologi Indonesia",
    period: "2016 - 2017",
    tone: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    points: [
      "Developed the Kudo Finance Portal for financial reconciliation and internal finance operations.",
      "Improved financial reporting workflows and operational efficiency.",
      "Automated operational processes reducing manual reconciliation tasks.",
    ],
  },
  {
    role: "Web Developer",
    company: "WEBARQ",
    period: "2014 - 2016",
    tone: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    points: [
      "Developed enterprise websites, e-commerce platforms, and custom web portals.",
      "Built scalable applications using PHP and Laravel.",
    ],
  },
  {
    role: "PHP Programmer",
    company: "PT Natasolusi Pratama",
    period: "2011 - 2014",
    tone: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    points: [
      "Maintained and enhanced the Kejaksaan Agung legal information portal for public users.",
      "Developed features supporting public legal information services.",
    ],
  },
];

const skills = [
  { label: "Frontend", value: "React.js, TypeScript, JavaScript, HTML5, CSS3, Webpack, Redux, Next.js" },
  { label: "Backend", value: "Golang, Node.js, PHP, Laravel" },
  { label: "Mobile", value: "Flutter" },
];

const highlights = [
  "Frontend architecture for high-scale merchant platforms",
  "Performance optimization and production stability",
  "Cross-functional delivery with product, design, backend, and QA",
  "Founder mindset with hands-on product execution",
];

export default function PortoPage() {
  return (
    <main className="min-h-screen pb-20">
      <section className="relative overflow-hidden px-4 pb-14 pt-14 sm:px-6 lg:px-10 lg:pb-20 lg:pt-20">
        <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-full -translate-x-1/2 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-60 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_420px]">
          <div className="space-y-8 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-primary shadow-lg shadow-primary/5 backdrop-blur sm:flex-nowrap sm:gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-primary/20 bg-background/70 text-sm font-black text-foreground">
                  H
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/90">Heriyadi</div>
                <Badge variant="outline" className="border-primary/20 bg-background/60 text-primary">
                  Portfolio
                </Badge>
              </div>
            </div>

            <div className="space-y-5">
              <h1 className="bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-4xl font-bold leading-[1.08] tracking-tighter text-transparent text-balance sm:text-5xl md:text-7xl">
                Senior frontend engineer building products that scale.
              </h1>
              <p className="mx-auto max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg md:text-xl lg:mx-0">
                I build scalable web and mobile applications across fintech, e-commerce, and merchant platforms. I work with
                React, TypeScript, Golang, and Flutter, with a focus on architecture, performance, and product delivery.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
              <a
                href="mailto:heriyadisst@gmail.com"
                className={buttonClassName({
                  size: "lg",
                  className: "rounded-full px-8 py-6 text-base font-bold shadow-xl shadow-primary/20 hover:opacity-90",
                })}
                style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
              >
                Contact Me
              </a>
              <a href="/heriyadi-cv-latest.pdf" download className={buttonClassName({ variant: "outline", size: "lg", className: "rounded-full px-8 py-6 text-base font-bold" })}>
                Download CV
              </a>
              <a
                href="https://linkedin.com/in/heriheriyadi"
                target="_blank"
                rel="noreferrer"
                className={buttonClassName({ variant: "outline", size: "lg", className: "rounded-full px-8 py-6 text-base font-bold" })}
              >
                LinkedIn
              </a>
            </div>

            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              <SubtleStat label="Experience" value="13+ years" helper="Frontend, web, and product engineering" />
              <SubtleStat label="Scale" value="Millions" helper="Merchants served across Southeast Asia" />
              <SubtleStat label="Impact" value="40%" helper="Page load reduction through optimization" />
            </div>
          </div>

          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card/70 to-card/90 shadow-2xl shadow-primary/10">
            <div className="border-b border-border/50 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold">CV Snapshot</div>
                  <div className="mt-1 text-xs text-muted-foreground">Yogyakarta, Indonesia</div>
                </div>
                <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                  Available
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/70 shadow-2xl shadow-black/10">
                <Image
                  src="/heriyadi-cv-preview-latest.png"
                  alt="Preview of Heriyadi CV"
                  width={612}
                  height={792}
                  priority
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card/70 to-card/90 shadow-2xl shadow-primary/10">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-7 p-8 lg:p-12">
              <Badge variant="outline" className="border-primary/20 bg-background/50 text-primary">
                Profile
              </Badge>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter text-balance lg:text-5xl">
                  Architecture-minded frontend delivery.
                </h2>
                <p className="text-base leading-8 text-muted-foreground lg:text-lg">
                  My work sits where product quality, speed, and maintainable systems meet. I enjoy turning complex flows into
                  reliable interfaces that teams can extend and users can trust.
                </p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
                <div className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Education</div>
                <div className="mt-3 text-lg font-bold">Bachelor&apos;s Degree in Information Technology</div>
                <div className="mt-1 text-sm text-muted-foreground">Institut Teknologi Bandung (ITB), Indonesia</div>
              </div>
            </div>

            <div className="grid gap-3 border-t border-border/50 bg-background/30 p-6 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:p-8">
              {highlights.map((item, index) => (
                <div key={item} className="rounded-2xl border border-border/50 bg-background/60 p-5">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">
                    0{index + 1}
                  </div>
                  <div className="text-sm font-semibold leading-6">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="outline" className="mb-4 border-primary/20 bg-background/50 text-primary">
              Experience
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Selected career timeline</h2>
          </div>
          <div className="text-sm text-muted-foreground">2011 - Present</div>
        </div>

        <div className="grid gap-5">
          {experience.map((item) => (
            <Card key={`${item.company}-${item.period}`} className="overflow-hidden border-border/40 hover:border-primary/30">
              <CardHeader className="bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">{item.role}</CardTitle>
                    <CardDescription className="mt-2 text-base">{item.company}</CardDescription>
                  </div>
                  <Badge variant="outline" className={item.tone}>
                    {item.period}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 md:grid-cols-3">
                  {item.points.map((point) => (
                    <li key={point} className="rounded-2xl border border-border/40 bg-background/45 p-4 text-sm leading-6 text-muted-foreground">
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-4">
            <Badge variant="outline" className="border-primary/20 bg-background/50 text-primary">
              Skills
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Modern product engineering toolkit.</h2>
            <p className="text-base leading-8 text-muted-foreground">
              Strongest in frontend systems, with backend and mobile fluency to move product work forward end to end.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((skill) => (
              <Card key={skill.label} className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg">{skill.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-muted-foreground">{skill.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
        <div className="space-y-8 rounded-[28px] border border-border/40 bg-gradient-to-br from-background via-card/70 to-primary/5 px-8 py-12 shadow-xl shadow-primary/5">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter">Let&apos;s build something reliable.</h2>
            <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground">
              Open to product-focused engineering work, frontend architecture, and modern web applications that need strong execution.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:heriyadisst@gmail.com"
              className={buttonClassName({
                size: "lg",
                className: "rounded-full px-8 shadow-lg shadow-primary/20 hover:opacity-90",
              })}
              style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
            >
              Email Heriyadi
            </a>
            <Link href="/login" className={buttonClassName({ variant: "ghost", size: "lg", className: "rounded-full px-8 text-muted-foreground hover:text-primary" })}>
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
