import Link from "next/link";
import { Card, CardContent, CardHeader, SectionTitle } from "@/components/ui";
import { buttonClassName } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-amber-500/20 bg-amber-500/5">
        <CardHeader className="border-b border-border/60">
          <SectionTitle eyebrow="404" title="Page not found" />
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <p className="text-sm leading-6 text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className={cn(buttonClassName(), "mt-6 inline-block w-full text-center")}
          >
            Back to Home
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
