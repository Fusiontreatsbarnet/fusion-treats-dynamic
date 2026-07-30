import "./globals.css";

export const metadata = {
  title: "Fusion Treats | High Barnet",
  description: "British classics meet bold Indian flavours — Fusion Treats, High Barnet.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
