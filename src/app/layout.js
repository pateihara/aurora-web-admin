import "./globals.css";

export const metadata = {
  title: "Aurora by Flui — Painel Web",
  description: "Painel administrativo funcional da plataforma Aurora by Flui",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}