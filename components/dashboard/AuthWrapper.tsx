"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabaseClient";
import { Shield, User, Lock, Key, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for saved session
    const savedUser = localStorage.getItem("intel_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("intel_user");
      }
    }
    setMounted(true);
  }, [setUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from("login_mapa")
        .select("*")
        .eq("username", username.trim())
        .eq("password", password.trim())
        .maybeSingle();

      if (queryError) {
        console.error("Login query error:", queryError);
        setError("Error de conexión al verificar las credenciales.");
      } else if (data) {
        const loggedUser = { username: data.username, role: data.role as 'admin' | 'reader' };
        setUser(loggedUser);
        localStorage.setItem("intel_user", JSON.stringify(loggedUser));
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[--color-void]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--color-accent]" />
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4 bg-[--color-void] relative overflow-hidden font-sans select-none">
      {/* Cinematic tech background grid pattern & radial gradients */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(var(--color-panel-border) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[--color-accent]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative scanline */}
      <div className="grain-overlay" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px] intel-panel rounded-2xl p-8 z-10 shadow-2xl bg-gradient-to-b from-[--color-surface] to-[--color-surface-elevated]"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[--color-accent-dim] border border-[--color-accent]/30 mb-4 shadow-lg shadow-[--color-accent]/10 relative group overflow-hidden">
            <Shield size={22} className="text-[--color-accent]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[--color-accent]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h1 className="display-title text-2xl tracking-tighter">
            COLOMBIA <span className="text-[--color-accent]">2026</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[--color-text-secondary] mt-1">
            Módulo de Acceso Controlado
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest text-[--color-text-secondary] font-extrabold flex items-center gap-1.5">
              <User size={10} className="text-[--color-text-muted]" /> Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej. lector o admin"
              className="w-full bg-[--color-surface-elevated] border border-[--color-panel-border] p-3 text-sm rounded-lg text-[--color-text-primary] placeholder:text-[--color-text-muted] focus:border-[--color-accent] outline-none transition-all shadow-inner focus:shadow-lg focus:shadow-[--color-accent]/5"
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest text-[--color-text-secondary] font-extrabold flex items-center gap-1.5">
              <Lock size={10} className="text-[--color-text-muted]" /> Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[--color-surface-elevated] border border-[--color-panel-border] p-3 pr-10 text-sm rounded-lg text-[--color-text-primary] placeholder:text-[--color-text-muted] focus:border-[--color-accent] outline-none transition-all shadow-inner focus:shadow-lg focus:shadow-[--color-accent]/5"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[--color-text-muted] hover:text-[--color-text-primary] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 p-3 rounded-lg bg-[--color-alert]/10 border border-[--color-alert]/20 text-[--color-alert] text-xs font-medium"
              >
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-gradient-to-r from-[--color-accent]/80 to-[--color-accent] hover:from-[--color-accent] hover:to-[--color-accent] py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-[--color-accent]/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 border border-[--color-accent]/30"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <Key size={12} />
                Ingresar al Sistema
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[--color-panel-border] flex flex-col items-center gap-1 text-[9px] text-[--color-text-muted] tracking-wide text-center uppercase">
          <span>Lectores: lectura completa · no edición</span>
          <span>Administradores: lectura y escritura</span>
        </div>
      </motion.div>
    </div>
  );
}
