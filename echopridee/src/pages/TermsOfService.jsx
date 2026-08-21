import React from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const termsHighlights = [
  { icon: 'fa-solid fa-shirt', title: '12-Piece MOQ', text: 'Minimum order quantity is 12 items per design with mix & match sizing.' },
  { icon: 'fa-solid fa-square-check', title: 'Proof Approval', text: 'Digital 2D/3D proofs are required to be approved before production begins.' },
  { icon: 'fa-solid fa-shield-halved', title: 'Quality Guarantee', text: 'Free replacement for any manufacturing defect or printing errors.' },
]

const termsSections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          By accessing or using the EchoPride website, services, or placing an order for custom sportswear, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our website or services.
        </p>
      </div>
    ),
  },
  {
    id: 'ordering-proofs',
    title: '2. Ordering, Minimums & Proof Approval',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          At EchoPride, we manufacture custom sublimated, embroidered, and printed sportswear.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
          <li><strong>Minimum Order Quantity (MOQ):</strong> Standard custom orders require a minimum of 12 pieces per design/style. You can mix and match sizes within this minimum.</li>
          <li><strong>Digital Proof Approval:</strong> Before production starts, our design team will provide a digital 2D/3D proof. Production will only commence after your explicit written or digital approval of the proof, colors, logos, and roster details.</li>
          <li><strong>Order Changes:</strong> Once a proof is approved and sent to the production line, no further modifications to design, sizes, or roster details can be accepted.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'manufacturing-tolerances',
    title: '3. Manufacturing Tolerances & Fabrics',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          Custom garment manufacturing involves specialized dye sublimation, embroidery, and cutting processes:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
          <li><strong>Color Matching:</strong> Due to screen resolution differences, digital proofs may vary slightly (5-10%) from physical fabric print colors. Pantone color matching is available upon request.</li>
          <li><strong>Sizing Tolerance:</strong> Custom hand-stitched garments carry an industry-standard manufacturing tolerance of ±0.5 to 1 inch.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'pricing-payment',
    title: '4. Pricing & Payment Terms',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          All prices are listed in US Dollars (USD) unless converted via our currency selector. Full payment is required at checkout before custom production begins. We accept major credit cards (VISA, MasterCard, Discover, AMEX) and PayPal.
        </p>
      </div>
    ),
  },
  {
    id: 'shipping-delivery',
    title: '5. Production Timeline & Shipping',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          Standard custom production requires 10 to 14 business days, followed by 3 to 7 business days for express courier transit (DHL, FedEx, USPS). EchoPride is not liable for shipping delays caused by weather, customs inspections, or carrier logistics beyond our control.
        </p>
      </div>
    ),
  },
  {
    id: 'returns-defects',
    title: '6. Returns, Replacements & Defect Claims',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          Because custom items are personalized specifically for your team, returns for buyer preference or incorrect size selection are non-refundable. However:
        </p>
        <p className="text-gray-600 leading-relaxed text-xs">
          If your order arrives with a manufacturing defect, damaged fabric, or printing discrepancy that differs from your approved proof, notify us within 7 days of delivery with photos, and we will remake and ship replacement items free of charge.
        </p>
      </div>
    ),
  },
  {
    id: 'intellectual-property',
    title: '7. Intellectual Property & Uploaded Logos',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          You warrant that you own or possess valid licenses for all logos, artwork, trademarks, and team graphics submitted to EchoPride for printing. You agree to indemnify EchoPride against any copyright or trademark infringement claims arising from your custom artwork.
        </p>
      </div>
    ),
  },
  {
    id: 'governing-law',
    title: '8. Contact Information',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          For questions regarding these Terms of Service, please reach out to our Customer Service team:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 space-y-1">
          <p><strong>Email:</strong> support@echopride.com</p>
          <p><strong>Phone:</strong> +1 (713) 997-5586</p>
          <p><strong>Address:</strong> EchoPride Custom Sportswear, Corona, CA, USA</p>
        </div>
      </div>
    ),
  },
]

export default function TermsOfService() {
  return (
    <InfoPageShell
      heroTag="TERMS & CONDITIONS"
      title="Terms of Service"
      intro="Please read these Terms of Service carefully before placing your order or using the EchoPride custom sportswear platform."
      image="/imgi_26_m3_banner_01.jpg"
      variant="split"
      heroAside={
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-sm ml-auto text-white">
          <p className="text-xs font-black uppercase tracking-wider text-[#baf120] mb-3">Service Terms Summary</p>
          <div className="space-y-3">
            {termsHighlights.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <i className={`${item.icon} text-[#baf120] text-base mt-0.5 shrink-0`}></i>
                <div>
                  <h4 className="text-xs font-bold">{item.title}</h4>
                  <p className="text-[11px] text-gray-300 leading-tight">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-10 py-6">
        {termsSections.map((sec) => (
          <div key={sec.id} className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              {sec.title}
            </h3>
            {sec.content}
          </div>
        ))}
      </div>
    </InfoPageShell>
  )
}
