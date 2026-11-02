import { ESLint } from 'eslint'
const eslint = new ESLint({ overrideConfigFile: 'eslint.fsd.config.js' })
const probes = [
  ['src/features/auth/model/probe.ts', "import { AppHeader } from '@/widgets/app-header'", 'boundaries/dependencies'],
  ['src/features/auth/model/probe.ts', "import { UserForm } from '@/features/user-form'", 'boundaries/dependencies'],
  ['src/entities/session/model/probe.ts', "import { UserService } from '@/entities/user'", 'boundaries/dependencies'],
  ['src/app/probe.ts', "import type { User } from '@/entities/user/model/types'", 'boundaries/dependencies'],
  ['src/app/probe.ts', "void import('@/pages/users/ui/UsersPage.vue')", 'boundaries/dependencies'],
  ['src/features/auth/model/probe.ts', "import Button from 'primevue/button'", 'no-restricted-imports'],
  ['src/shared/api/probe.ts', "import { useUsersStore } from '@/entities/user'", 'boundaries/dependencies'],
]
for (const [filePath, code, expected] of probes) {
  const [result] = await eslint.lintText(code, { filePath })
  if (!result.messages.some(message => message.ruleId === expected && message.severity === 2)) {
    throw new Error(`FSD violation was not rejected: ${filePath}, ${code}. ${JSON.stringify(result.messages)}`)
  }
}
const [valid] = await eslint.lintText("import { useUsersStore } from '@/entities/user'", { filePath: 'src/features/auth/model/probe.ts' })
if (valid.errorCount) throw new Error(`Valid dependency was rejected: ${JSON.stringify(valid.messages)}`)
console.log('Seven invalid import cases rejected; valid public API import accepted.')
