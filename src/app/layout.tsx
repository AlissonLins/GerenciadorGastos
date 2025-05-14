
import Navbar from "@/components/Navbar";
import Lancamento from "@/app/pages/lancamentos/Lancamento";
import Limites from "@/app/pages/limites/Limites";
import "./globals.css";
import { FinanceProvider } from "@/components/FinanceContext";


export default function RootLayout({children,}: Readonly<{
  children: React.ReactNode;
}>)
{
  return (
    <html lang="pt-br">
      <body>
        <Navbar />
        <FinanceProvider>
          {children}
          <Lancamento/>
          <Limites />
        </FinanceProvider>
      </body>
    </html>
  );
}
