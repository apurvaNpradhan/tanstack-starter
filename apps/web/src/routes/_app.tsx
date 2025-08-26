import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context }) => {
    if (!context.session?.user) {
      throw redirect(({
        to: "/login"
      }))
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
