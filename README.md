This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Para desplegar esta aplicación en Vercel, sigue estos pasos:

1. Crea una cuenta en [Vercel](https://vercel.com) si aún no tienes una.
2. Conecta tu repositorio de GitHub a Vercel.
3. **Importante**: Configura las siguientes variables de entorno en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto en Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave anónima de tu proyecto en Supabase

Puedes encontrar estas credenciales en [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api) en la sección API.

### Solución de problemas comunes

- Si encuentras errores de prerenderizado durante el despliegue, verifica que las variables de entorno estén correctamente configuradas.
- La aplicación está configurada para usar `dynamic = 'force-dynamic'` en páginas que requieren autenticación para evitar problemas de prerenderizado.

Para más detalles sobre el despliegue de Next.js, consulta la [documentación oficial](https://nextjs.org/docs/app/building-your-application/deploying).
