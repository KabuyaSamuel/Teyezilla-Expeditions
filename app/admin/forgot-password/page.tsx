import Image from "next/image";
import Link from "next/link";
import ForgotPasswordForm from "@/components/admin/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-float rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 animate-float rounded-full bg-accent/10 blur-3xl [animation-delay:2s]"
      />

      <div className="relative w-full max-w-md">
        <div className="flex animate-fadeUp flex-col items-center text-center">
          <Image src="/logo.png" alt="Teyezilla Expeditions" width={132} height={127} priority quality={70} className="h-16 w-auto" />
        </div>

        <div className="card mt-6 animate-fadeUp p-8 [animation-delay:100ms]">
          <h1 className="text-center font-heading text-2xl font-bold text-foreground">
            Reset <span className="text-accent">Password</span>
          </h1>
          <p className="mt-1 text-center text-sm text-foreground/60">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <ForgotPasswordForm />

          <Link href="/admin/login" className="mt-6 block text-center text-sm font-medium text-primary">
            Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
