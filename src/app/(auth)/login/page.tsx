import LoginForm from "@/components/auth/LoginForm";
import LogoMark from "@/components/shared/Logo";
import Link from "next/link";

export default async function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-11 lg:py-0">
      <div className="w-full max-w-150">
        <div className="lg:hidden mb-10 flex justify-center">
          <LogoMark showText sizeText="text-3xl" size={35} />
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-secondary leading-tight">
            Entrar na sua conta
          </h1>
          <p className="mt-2 text-muted-foreground text-base">
            Acompanhe suas candidaturas em um só lugar.
          </p>
        </div>
        <LoginForm />
        <p
          className="text-center text-sm text-gray-500"
          style={{
            marginTop: "8px",
            marginBottom: "8px",
            paddingTop: "8px",
            paddingBottom: "8px",
          }}
        >
          Não tem uma conta?{" "}
          <Link
            href={"/register"}
            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors underline-offset-2 hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
