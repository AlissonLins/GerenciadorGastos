import type { NextConfig } from "next";

const NextConfig = {
  output: 'export', // Habilita exportação estática
  distDir: 'out', // Pasta de saída
  basePath: process.env.NODE_ENV === 'production' ? '/GerenciadorGastos' : '', // Substitua pelo nome do seu repositório
  images: {
    unoptimized: true, // Necessário para exportação estática
  },
}

module.exports = NextConfig
