import Image from "next/image";
import ResetPasswordForm from "@/components/admin/ResetPasswordForm";

export default function ResetPasswordPage() {
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
            Set New <span className="text-accent">Password</span>
          </h1>
          <p className="mt-1 text-center text-sm text-foreground/60">Choose a new password for your account.</p>

          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
