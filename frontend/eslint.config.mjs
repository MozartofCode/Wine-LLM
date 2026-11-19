import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

const eslintConfig = [
  {
    // Generated shadcn/ui components and config files are vendor code, not app code.
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "components/ui/**", "hooks/use-toast.ts", "tailwind.config.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
]

export default eslintConfig
