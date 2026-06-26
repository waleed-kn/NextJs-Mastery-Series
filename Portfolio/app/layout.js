import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Waleed Portfolio",
  description: "MERN Stack Developer & Focuses AI Engineer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/project">Project</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}