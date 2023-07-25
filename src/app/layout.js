import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={{}}>
        <div id="application" className="position-relative">
          {children}
        </div>
      </body>
    </html>
  );
}
