import React, { useState, useEffect } from 'react'
import { SIZE_FRAMEWORKS, detectSizingCategory } from '../utils/sizes'

export default function SizeGuideModal({ isOpen, onClose, product }) {
  const defaultTab = detectSizingCategory(product)
  const [activeTabId, setActiveTabId] = useState(defaultTab)

  useEffect(() => {
    if (isOpen) {
      setActiveTabId(detectSizingCategory(product))
    }
  }, [isOpen, product])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const activeFramework = SIZE_FRAMEWORKS.find((f) => f.id === activeTabId) || SIZE_FRAMEWORKS[0]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d1117] border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-neutral-800/80 bg-neutral-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#baf120]/15 text-[#baf120] border border-[#baf120]/30 flex items-center justify-center text-lg font-black shadow-inner">
              <i className="fa-solid fa-ruler-combined"></i>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-extrabold text-white leading-tight">
                Combat & Athletic Apparel Size Guide
              </h2>
              <p className="text-xs text-gray-400">
                Standard equipment and clothing sizing specifications
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            aria-label="Close size guide"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 p-3 sm:p-4 overflow-x-auto border-b border-neutral-800 bg-black/40 scrollbar-none">
          {SIZE_FRAMEWORKS.map((framework) => {
            const isActive = framework.id === activeTabId
            return (
              <button
                key={framework.id}
                type="button"
                onClick={() => setActiveTabId(framework.id)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#baf120] text-black border-[#baf120] shadow-lg shadow-[#baf120]/20 scale-[1.02]'
                    : 'bg-neutral-900/60 text-gray-400 border-neutral-800 hover:border-neutral-600 hover:text-gray-200'
                }`}
              >
                <span>
                  {framework.id === 'boxing_gloves' && '🥊'}
                  {framework.id === 'mma_gloves' && '🤼'}
                  {framework.id === 'apparel_tops' && '👕'}
                  {framework.id === 'apparel_bottoms' && '🩳'}
                  {framework.id === 'protective_gear' && '🛡️'}
                </span>
                <span>{framework.title.split('(')[0]}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span className="text-[#baf120]">•</span> {activeFramework.title}
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#baf120]/10 text-[#baf120] px-2.5 py-1 rounded border border-[#baf120]/30">
                Official Spec
              </span>
            </div>
            <p className="text-xs text-gray-400">{activeFramework.subtitle}</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/60 text-gray-300 uppercase tracking-wider text-[11px] font-black border-b border-neutral-800">
                <tr>
                  {activeFramework.headers.map((h, idx) => (
                    <th key={idx} className="py-3.5 px-4 font-extrabold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-gray-300">
                {activeFramework.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-black text-[#baf120] whitespace-nowrap">
                      {row.size}
                    </td>
                    {row.weight && <td className="py-3.5 px-4 font-medium">{row.weight}</td>}
                    {row.knuckles && <td className="py-3.5 px-4 font-medium">{row.knuckles}</td>}
                    {row.purpose && (
                      <td className="py-3.5 px-4">
                        <span className="inline-block bg-white/5 text-gray-300 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-white/10">
                          {row.purpose}
                        </span>
                      </td>
                    )}
                    {row.length && <td className="py-3.5 px-4 font-medium">{row.length}</td>}
                    {row.width && <td className="py-3.5 px-4 font-medium">{row.width}</td>}
                    {row.waistInch && (
                      <td className="py-3.5 px-4 font-medium">{row.waistInch}</td>
                    )}
                    {row.waistCm && <td className="py-3.5 px-4 font-medium">{row.waistCm}</td>}
                    {row.outseam && <td className="py-3.5 px-4 font-medium">{row.outseam}</td>}
                    {row.spec && <td className="py-3.5 px-4 font-medium">{row.spec}</td>}
                    {row.height && <td className="py-3.5 px-4 font-medium">{row.height}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sizing Tips */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex items-start gap-3">
            <div className="text-[#baf120] text-base mt-0.5 shrink-0">
              <i className="fa-solid fa-lightbulb"></i>
            </div>
            <div className="space-y-1 text-xs text-gray-300 leading-relaxed">
              <p className="font-bold text-white uppercase text-[11px] tracking-wider">
                Pro Tip For Bulk & Team Ordering:
              </p>
              <p className="text-gray-400">
                If you are between two sizes or plan to wear hand wraps (180″) under gloves or rashguards under hoodies, we recommend choosing the larger size for comfortable training fit.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-black/60 flex items-center justify-between">
          <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
            Need custom team sizing advice? Contact EchoPride Wholesale Team
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#baf120] hover:bg-[#a6e216] text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#baf120]/20"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}
