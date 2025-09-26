"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"

interface RouletteWheelProps {
  prizes: string[]
  isSpinning: boolean
  winnerIndex: number | null
  onStop: () => void
}

export function RouletteWheel({ prizes, isSpinning, winnerIndex, onStop }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [isStopping, setIsStopping] = useState(false)
  const segmentAngle = 360 / prizes.length
  const wheelRef = useRef<SVGSVGElement>(null)
  const currentRotation = useRef(0) // 現在の回転角度を保持

  useEffect(() => {
    const wheel = wheelRef.current
    if (!wheel) return

    const handleTransitionEnd = () => {
      if (isStopping) {
        setIsStopping(false)
        onStop()
      }
    }
    
    wheel.addEventListener('transitionend', handleTransitionEnd)
    return () => wheel.removeEventListener('transitionend', handleTransitionEnd)
  }, [isStopping, onStop])

  useEffect(() => {
    if (isSpinning) {
      // 1. まずは高速で回転し続ける
      const spinInterval = setInterval(() => {
        currentRotation.current -= 20 // 回転速度
        if (wheelRef.current) {
          wheelRef.current.style.transition = 'none'
          wheelRef.current.style.transform = `rotate(${currentRotation.current}deg)`
        }
      }, 16)

      // 4秒後に停止処理を開始
      const stopTimeout = setTimeout(() => {
        clearInterval(spinInterval)
        if (winnerIndex !== null) {
          const startOfSegmentAngle = winnerIndex * segmentAngle;
          const overshootOffset = segmentAngle * (0.1 + Math.random() * 0.1);
          const targetAngle = startOfSegmentAngle + overshootOffset;
          
          const fullRotations = Math.floor(currentRotation.current / 360)
          const finalRotation = (fullRotations * 360) - targetAngle
          
          setRotation(finalRotation)
          setIsStopping(true)
        }
      }, 4000)

      return () => {
        clearInterval(spinInterval)
        clearTimeout(stopTimeout)
      }
    } else {
      // isSpinningがfalseになったらリセット
      setRotation(0)
      currentRotation.current = 0
    }
  }, [isSpinning, winnerIndex, segmentAngle])


  const colors = [
    "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1",
    "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8",
  ]

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 drop-shadow-lg">
        <div className="w-0 h-0 
          border-l-[12px] border-l-transparent
          border-r-[12px] border-r-transparent
          border-t-[24px] border-t-primary-foreground"
        />
      </div>

      <div className="relative w-80 h-80 mx-auto">
        <svg
          ref={wheelRef}
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="transform"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isStopping ? 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
          }}
        >
          {prizes.map((prize, index) => {
            const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
            const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)
            const largeArcFlag = segmentAngle > 180 ? 1 : 0

            const x1 = 160 + 140 * Math.cos(startAngle)
            const y1 = 160 + 140 * Math.sin(startAngle)
            const x2 = 160 + 140 * Math.cos(endAngle)
            const y2 = 160 + 140 * Math.sin(endAngle)

            const textAngle = index * segmentAngle + segmentAngle / 2 - 90
            const textRadius = 100
            const textX = 160 + textRadius * Math.cos(textAngle * (Math.PI / 180))
            const textY = 160 + textRadius * Math.sin(textAngle * (Math.PI / 180))

            return (
              <g key={index}>
                <path
                  d={`M 160 160 L ${x1} ${y1} A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={colors[index % colors.length]}
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#000"
                  transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                >
                  {prize}
                </text>
              </g>
            )
          })}

          <circle cx="160" cy="160" r="20" fill="#333" stroke="#fff" strokeWidth="3" />
        </svg>
      </div>
    </div>
  )
}