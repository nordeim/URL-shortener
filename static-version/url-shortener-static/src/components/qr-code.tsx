'use client'

import { useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { cn } from '@/lib/utils'

interface QRCodeProps {
  value: string
  size?: number
  level?: 'L' | 'M' | 'Q' | 'H'
  className?: string
  includeMargin?: boolean
  bgColor?: string
  fgColor?: string
}

export function QRCode({
  value,
  size = 200,
  level = 'M',
  className,
  includeMargin = true,
  bgColor = '#ffffff',
  fgColor = '#000000',
}: QRCodeProps) {
  const qrProps = useMemo(() => ({
    value,
    size,
    level,
    includeMargin,
    bgColor,
    fgColor,
  }), [value, size, level, includeMargin, bgColor, fgColor])

  return (
    <div className={cn('qr-code inline-block p-4 bg-white rounded-lg', className)}>
      <QRCodeSVG {...qrProps} />
    </div>
  )
}

export default QRCode