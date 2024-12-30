import { Inter } from "next/font/google";
import "./globals.css";
import GlobalProvider from "../context/globalContext";
import AdminProvider from "@/context/adminContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HealthHaven Admin",
  description: "",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className='overflow-hidden bg-[white]'>
        <GlobalProvider>
          <AdminProvider>
            {children}
          </AdminProvider>
        </GlobalProvider>
      </body>
    </html >
  );
}
