"use client";

// Botão em pílula que "esquenta" a partir do ponto onde o cursor entra.
export function Pilula({
  href,
  cheia = false,
  destaque = false,
  termico = false,
  children,
}: {
  href: string;
  cheia?: boolean;
  destaque?: boolean;
  termico?: boolean;
  children: React.ReactNode;
}) {
  const posicionar = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <a
      href={href}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`pilula${cheia ? " pilula-cheia" : ""}${destaque ? " pilula-destaque" : ""}`}
      data-termico={termico || undefined}
      onPointerEnter={posicionar}
      onPointerMove={posicionar}
    >
      <span>{children}</span>
    </a>
  );
}
