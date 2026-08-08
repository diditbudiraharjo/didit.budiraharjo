import "./globals.css";

export const metadata = {
  title: "didit.budiraharjo",
  description: "didit.budiraharjo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
