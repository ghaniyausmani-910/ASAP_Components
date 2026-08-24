'use client'

import { useState } from 'react'
import { Upload, FileCheck2 } from 'lucide-react'

export function BomUpload() {
  const [file, setFile] = useState<string | null>(null)

  return (
    <div className="relative overflow-hidden bg-navy p-6 text-white sm:p-8">
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(135deg,#fff_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <Upload size={40} className="shrink-0 text-white" />
        <div className="flex-1">
          <p className="font-display text-lg font-medium">Have multiple parts?</p>
          <p className="mt-1 text-sm text-white/70">Upload your parts list or Bill of Materials (BOM) and we&apos;ll quote the whole list.</p>
        </div>
        <label className="btn btn-inverse cursor-pointer whitespace-nowrap">
          {file ? <><FileCheck2 size={16} /> {file}</> : <><Upload size={16} /> Upload BOM</>}
          <input
            type="file"
            className="sr-only"
            accept=".csv,.xls,.xlsx,.pdf,.txt"
            onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
          />
        </label>
      </div>
    </div>
  )
}
