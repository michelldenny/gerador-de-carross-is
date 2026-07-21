"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    if (mode === "signup" && !result.data.session) {
      setMessage("Confira seu e-mail para confirmar o cadastro.");
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(next || "/dashboard");
    router.refresh();
  }

  async function recoverPassword() {
    if (!email) return setMessage("Informe seu e-mail primeiro.");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    });
    setMessage(error?.message ?? "Enviamos as instrucoes para seu e-mail.");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-900 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-600">BrandsDecoded</p>
        <h1 className="mt-3 text-3xl font-extrabold">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
        <p className="mt-2 text-sm text-slate-500">Acesse seus projetos, marcas e geracoes.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input aria-label="E-mail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500" />
          <input aria-label="Senha" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500" />
          {message && <p role="status" className="text-sm text-slate-600">{message}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-violet-600 px-4 py-3 font-bold text-white disabled:opacity-50">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
          </button>
        </form>
        <div className="mt-5 flex items-center justify-between text-sm">
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-semibold text-violet-700">
            {mode === "login" ? "Criar uma conta" : "Ja tenho conta"}
          </button>
          <button onClick={recoverPassword} className="text-slate-500">Esqueci a senha</button>
        </div>
      </section>
    </main>
  );
}
