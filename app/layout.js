import "./globals.css";

export const metadata = {
  title: "The House | Elite VC + Labs + Community",
  description: "An elite Silicon Valley hub connecting capital, research, and visionary founders.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
