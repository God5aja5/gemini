import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MessageSquare } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-red-600" />
            <span className="font-semibold text-red-600">SUKUNA CHAT BOT</span>
          </div>
          <div className="flex-1" />
          <Link href="/auth">
            <Button variant="outline" className="mr-2">
              Log in
            </Button>
          </Link>
          <Link href="/auth?tab=register">
            <Button>Sign up</Button>
          </Link>
        </div>
      </nav>

      <main>
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Experience the Power of SUKUNA
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Engage with SUKUNA's advanced AI chatbot. Built by SUKUNA DEVELOPER,
                    featuring intelligent responses, code assistance, and creative problem-solving.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth?tab=register">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                      Try Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[600px] sm:min-h-[400px] rounded-lg bg-muted p-8">
                <div className="rounded-lg border bg-background p-4">
                  <div className="flex items-start gap-4 mb-4">
                    <MessageSquare className="h-8 w-8 mt-1 text-red-600" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">SUKUNA</p>
                      <p className="text-sm text-muted-foreground">
                        Welcome! I'm SUKUNA, your AI companion powered by advanced technology.
                        How can I assist you today?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="h-9 rounded-md border bg-muted px-3 py-1 text-sm">
                        Ask me anything...
                      </div>
                    </div>
                    <Button size="icon" className="shrink-0">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}