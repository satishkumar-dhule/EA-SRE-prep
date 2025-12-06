import { getAllGuides } from '../../../lib/guides'

export async function generateStaticParams() {
  return getAllGuides().map((guide) => ({
    slug: guide.slug,
  }))
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
