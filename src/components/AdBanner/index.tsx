import { useEffect, useRef } from 'react'
import { useStore } from '@/store'
import { THEMES } from '@/theme'

// ── AdSense config ────────────────────────────────────────────────────────────
// Replace these with your real values from AdSense dashboard after approval:
//   https://www.google.com/adsense
// Publisher ID format:  ca-pub-XXXXXXXXXXXXXXXX
// Ad slot ID format:    XXXXXXXXXX
const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX'
const AD_SLOT_BANNER      = 'XXXXXXXXXX'  // 320×50  (leaderboard/banner — mobile)
const AD_SLOT_RECTANGLE   = 'XXXXXXXXXX'  // 300×250 (medium rectangle — sidebar)

const CONFIGURED = !ADSENSE_PUBLISHER_ID.includes('XXXX')

type AdSize = 'banner' | 'rectangle'

interface AdBannerProps {
  size?: AdSize
  className?: string
}

// Dimensions per size type
const AD_DIMS: Record<AdSize, { w: number; h: number; label: string }> = {
  banner:    { w: 320, h:  50, label: '320 × 50' },
  rectangle: { w: 300, h: 250, label: '300 × 250' },
}

export function AdBanner({ size = 'banner', className = '' }: AdBannerProps) {
  const { themeId } = useStore()
  const isDark = THEMES[themeId].isDark
  const adRef = useRef<HTMLModElement>(null)
  const { w, h, label } = AD_DIMS[size]

  useEffect(() => {
    if (!CONFIGURED) return
    try {
      // Push the ad unit after mount — required by AdSense
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (_) {}
  }, [])

  if (!CONFIGURED) {
    // Placeholder shown until AdSense is configured
    return (
      <div
        className={`flex items-center justify-center rounded-xl text-xs font-mono ${className}`}
        style={{
          width: w,
          height: h,
          maxWidth: '100%',
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          border: `1.5px dashed ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
          color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
        }}
      >
        Quảng cáo · {label}
      </div>
    )
  }

  return (
    <div className={className} style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: w, height: h, maxWidth: '100%' }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={size === 'banner' ? AD_SLOT_BANNER : AD_SLOT_RECTANGLE}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
