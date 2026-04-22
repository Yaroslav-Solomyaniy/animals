'use client'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { BorderBeam } from '@/components/ui/border-beam'

export const WobbleCard = ({
  children,
  containerClassName,
  className,
  beamColorFrom = '#f97316',
  beamColorTo = '#10b981',
  beamDelay = 0,
  beamDuration = 7,
  beamSize = 180,
}: {
  children: React.ReactNode
  containerClassName?: string
  className?: string
  beamColorFrom?: string
  beamColorTo?: string
  beamDelay?: number
  beamDuration?: number
  beamSize?: number
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (clientX - (rect.left + rect.width / 2)) / 20
    const y = (clientY - (rect.top + rect.height / 2)) / 20
    setMousePosition({ x, y })
  }
  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)',
        transition: 'transform 0.1s ease-out',
      }}
      className={cn(
        'relative mx-auto w-full overflow-hidden rounded-3xl border border-gray-200',
        containerClassName,
      )}
    >
      <div
        className="relative h-full overflow-hidden rounded-[inherit] ring-1 ring-inset ring-white/70 [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.72),rgba(255,255,255,0))] sm:mx-0"
        style={{
          boxShadow:
            '0 1px 1px rgba(15, 23, 42, 0.03), 0 14px 42px rgba(15, 23, 42, 0.05)',
        }}
      >
        <motion.div
          style={{
            transform: isHovering
              ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
              : 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)',
            transition: 'transform 0.1s ease-out',
          }}
          className={cn('h-full px-4 py-16 sm:px-10', className)}
        >
          <Noise />
          {children}
        </motion.div>
      </div>
      <BorderBeam
        size={beamSize}
        duration={beamDuration}
        delay={beamDelay}
        borderWidth={2}
        colorFrom={beamColorFrom}
        colorTo={beamColorTo}
      />
    </motion.section>
  )
}

const Noise = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-[0.28] mix-blend-multiply"
      style={{
        backgroundImage: 'url(/noise.webp)',
        backgroundRepeat: 'repeat',
        backgroundSize: '140px 140px',
      }}
    />
  )
}
