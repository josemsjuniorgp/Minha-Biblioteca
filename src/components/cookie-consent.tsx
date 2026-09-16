"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "industria360:cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // localStorage só existe no cliente — não dá pra ler durante o render
    // do servidor, então o estado inicial (oculto) só é corrigido aqui.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(!localStorage.getItem(STORAGE_KEY));
    } catch {
      // localStorage indisponível (modo privado, etc.) — não bloqueia a navegação.
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "aceito");
    } catch {
      // ver comentário acima.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-brand-ink px-4 py-4 text-white sm:px-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-white/85">
          Usamos cookies essenciais para manter seu login e, futuramente, para
          medir audiência e exibir publicidade. Ao continuar navegando, você
          concorda com nossa política de privacidade.
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-md bg-brand-amber px-5 py-2 text-sm font-medium text-brand-ink hover:brightness-95"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
