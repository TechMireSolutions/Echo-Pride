import React from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const privacyHighlights = [
  { icon: 'fa-solid fa-lock', title: 'Data Security', text: 'All transactions and user details are protected with 256-bit SSL encryption.' },
  { icon: 'fa-solid fa-user-shield', title: 'Privacy Guaranteed', text: 'We never sell or rent your personal information to third parties for marketing.' },
  { icon: 'fa-solid fa-handshake-angle', title: 'Control & Choice', text: 'Manage your profile, email preferences, and data privacy settings anytime.' },
]

const policySections = [
  {
    id: 'info-collection',
    title: '1. Information We Collect',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          We collect personal information that you voluntarily provide to us when placing an order, registering an account, subscribing to our newsletter, or contacting our support team.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
          <li><strong>Personal Details:</strong> Name, shipping address, billing address, phone number, and email address.</li>
          <li><strong>Customization Specs:</strong> Team roster lists, player numbers, artwork files, and custom logos submitted for production.</li>
          <li><strong>Payment Information:</strong> Credit card details, PayPal tokens, and billing metadata processed securely through encrypted gateways.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, device identifiers, and cookies to improve browsing experience.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'info-usage',
    title: '2. How We Use Your Information',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          Your information is used strictly to fulfill your orders, provide high-quality custom sportswear manufacturing, and improve our services:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
          <li>To manufacture, print, custom-sublimate, and ship your sportswear orders.</li>
          <li>To send order confirmations, digital 2D/3D mockups, and shipment tracking info.</li>
          <li>To provide dedicated customer support and handle warranty or return requests.</li>
          <li>To send promotional emails and exclusive team discounts (only if opted in).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'info-sharing',
    title: '3. Data Sharing & Third Parties',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          EchoPride does not sell or trade your data. We only share necessary data with trusted third-party service providers essential to operating our business:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
          <li><strong>Logistics Partners:</strong> Courier services (DHL, FedEx, USPS) to deliver your parcels.</li>
          <li><strong>Payment Processors:</strong> PCI-compliant payment gateways (Stripe, PayPal, Merchant Services).</li>
          <li><strong>Legal Requirements:</strong> When required by law, subpoena, or to protect EchoPride's legal rights.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'data-security',
    title: '4. Data Security & Storage',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          We maintain industry-standard physical, technical, and organizational safeguards to protect your personal information against unauthorized access, loss, or misuse. All custom artwork and design specs are stored on encrypted servers for easy reordering.
        </p>
      </div>
    ),
  },
  {
    id: 'your-rights',
    title: '5. Your Privacy Rights',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          You have the right to access, update, or request the deletion of your personal data at any time. You can also opt-out of marketing communications by clicking the "Unsubscribe" link in any email or contacting customer support.
        </p>
      </div>
    ),
  },
  {
    id: 'contact-privacy',
    title: '6. Privacy Inquiries & Support',
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed text-sm">
          If you have questions or concerns regarding this Privacy Policy or your personal data, please contact our Legal & Privacy team:
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

export default function PrivacyPolicy() {
  return (
    <InfoPageShell
      heroTag="LEGAL & PRIVACY"
      title="Privacy Policy"
      intro="Your trust is our highest priority. Learn how EchoPride collects, uses, and safeguards your personal data."
      image="/imgi_27_m3_banner_022.jpg"
      variant="split"
      heroAside={
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-sm ml-auto text-white">
          <p className="text-xs font-black uppercase tracking-wider text-[#baf120] mb-3">Privacy Highlights</p>
          <div className="space-y-3">
            {privacyHighlights.map((item) => (
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
        {policySections.map((sec) => (
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
