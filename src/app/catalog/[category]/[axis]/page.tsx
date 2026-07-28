import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { RfqSidebar } from '@/components/modules/RfqSidebar'
import { DirectoryIndex } from '@/components/catalog/DirectoryIndex'
import { PartsListingTable } from '@/components/catalog/PartsListingTable'
import { CageTable } from '@/components/catalog/CageTable'
import { Certifications } from '@/components/modules/Certifications'
import { CATEGORIES, getAxis } from '@/lib/data/catalog'
import type { DropdownItem } from '@/lib/types'
import {
  groupAlphabetical, numericGroups, partTypePool, MANUFACTURERS, cageRows, FSC_CODES, generateParts,
} from '@/lib/data/parts'

export function generateStaticParams() {
  return CATEGORIES.flatMap((c) => c.items.map((i) => ({ category: c.slug, axis: i.slug })))
}

export function generateMetadata({ params }: { params: { category: string; axis: string } }): Metadata {
  const found = getAxis(params.category, params.axis)
  if (!found) return { title: 'Catalog' }
  return { title: found.item.heading, description: found.item.intro }
}

export default function CatalogAxisPage({ params }: { params: { category: string; axis: string } }) {
  const found = getAxis(params.category, params.axis)
  if (!found) notFound()
  const { category, item } = found
  const catWord = category.label.split(' ')[0]

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: category.label }, { label: item.label }]} />

      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="eyebrow">{category.label}</p>
              <h1 className="mt-3 font-display text-h2 font-light tracking-tight-2">{item.heading}</h1>
              <p className="mt-4 max-w-3xl text-body-lg text-secondary">{item.intro}</p>

              <div className="mt-10">
                {renderBody(category.slug, item)}
              </div>
            </div>

            <RfqSidebar contextLabel={catWord} />
          </div>
        </Container>
      </section>

      <Certifications />
    </>
  )
}

function renderBody(categorySlug: string, item: DropdownItem) {
  // Direct listings (Standard Parts, Featured Parts)
  if (item.type === 'listing' || item.type === 'listing-enhanced') {
    const parts = generateParts(`listing:${item.slug}`, 90, {
      withDescription: item.type === 'listing-enhanced',
      extra: item.extraColumns?.[0]?.key,
    })
    return (
      <PartsListingTable
        parts={parts}
        categorySlug={categorySlug}
        showDescription={item.type === 'listing-enhanced'}
        extraColumn={item.extraColumns?.[0]}
      />
    )
  }

  // Directory variants
  switch (item.kind) {
    case 'manufacturer':
      return <DirectoryIndex groups={groupAlphabetical(MANUFACTURERS)} categorySlug={categorySlug} searchLabel="Search by manufacturer name…" />
    case 'niin':
      return <DirectoryIndex groups={numericGroups('niin', `${categorySlug}:niin`)} categorySlug={categorySlug} numeric />
    case 'nsn':
      return <DirectoryIndex groups={numericGroups('nsn', `${categorySlug}:nsn`)} categorySlug={categorySlug} numeric />
    case 'cage':
      return <CageTable rows={cageRows(`${categorySlug}:cage`, 240)} />
    case 'fsc':
      return <FscTable categorySlug={categorySlug} />
    case 'part-type':
    default:
      return <DirectoryIndex groups={groupAlphabetical(partTypePool(categorySlug, item.slug))} categorySlug={categorySlug} searchLabel="Search part types…" />
  }
}

function FscTable({ categorySlug }: { categorySlug: string }) {
  return (
    <div className="overflow-x-auto border border-hairline">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="bg-navy text-left text-white">
            <th className="px-4 py-3 font-medium">FSC</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 text-right font-medium">Parts</th>
          </tr>
        </thead>
        <tbody>
          {FSC_CODES.map((f) => (
            <tr key={f.code} className="border-t border-hairline hover:bg-surface">
              <td className="px-4 py-3 font-mono text-navy">{f.code}</td>
              <td className="px-4 py-3">
                <Link href={`/catalog/${categorySlug}/list/${f.code}`} className="text-secondary hover:text-accent hover:underline">{f.label}</Link>
              </td>
              <td className="px-4 py-3 text-right text-tertiary">{f.count.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
