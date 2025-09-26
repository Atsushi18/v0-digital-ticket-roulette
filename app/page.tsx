"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RouletteWheel } from "@/components/roulette-wheel"
import { PrizeTicket } from "@/components/prize-ticket"
import { Download, RotateCcw, Settings, Upload, X } from "lucide-react"

export default function RoulettePage() {
  const prizes = ["ごちそう券", "はずれ", "はずれ", "はずれ", "はずれ", "はずれ", "はずれ", "はずれ"]

  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [showTicket, setShowTicket] = useState(false)
  const [showCutIn, setShowCutIn] = useState(false)
  const [initialResult, setInitialResult] = useState<string | null>(null)
  const [cutinMedia, setCutinMedia] = useState<string | null>(null)
  const [cutinMediaType, setCutinMediaType] = useState<"image" | "video" | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [ticketRef, setTicketRef] = useState<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showMediaUpload, setShowMediaUpload] = useState(false)

  const handlePasswordSubmit = () => {
    const correctPassword = "admin123" // 合言葉を設定
    if (password === correctPassword) {
      setIsAuthenticated(true)
      setShowPasswordModal(false)
      setShowSettings(true)
      setPassword("")
    } else {
      alert("合言葉が間違っています")
      setPassword("")
    }
  }

  const handleSettingsClick = () => {
    if (isAuthenticated) {
      setShowSettings(!showSettings)
    } else {
      setShowPasswordModal(true)
    }
  }

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileType = file.type
    if (fileType.startsWith("image/")) {
      setCutinMediaType("image")
    } else if (fileType.startsWith("video/")) {
      setCutinMediaType("video")
    } else {
      alert("画像または動画ファイルを選択してください")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setCutinMedia(e.target?.result as string)
      setShowMediaUpload(false)
    }
    reader.readAsDataURL(file)
  }

  const removeCutinMedia = () => {
    setCutinMedia(null)
    setCutinMediaType(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const spinRoulette = () => {
    if (isSpinning || prizes.length === 0) return

    setIsSpinning(true)
    setWinner(null)
    setShowTicket(false)
    setShowCutIn(false)
    setInitialResult(null)

    setTimeout(() => {
      setInitialResult("はずれ")
      setWinner("はずれ")
      setIsSpinning(false)

      setTimeout(() => {
        setShowCutIn(true)

        setTimeout(() => {
          setWinner("ごちそう券")
          setShowCutIn(false)

          // Show ticket after winning
          setTimeout(() => setShowTicket(true), 1000)
        }, 2000)
      }, 2000)
    }, 3000)
  }

  const downloadTicket = () => {
    if (!winner || winner === "はずれ") return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 500

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#fbbf24") // yellow-400
    gradient.addColorStop(1, "#f59e0b") // yellow-500

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw ticket background
    ctx.fillStyle = "#ffffff"
    ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 10)
    ctx.fill()

    // Draw border
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 4
    ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 10)
    ctx.stroke()

    // Draw title
    ctx.fillStyle = "#1f2937"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("🎫 デジタル券", canvas.width / 2, 80)

    // Draw prize name
    ctx.font = "bold 32px Arial"
    ctx.fillStyle = "#dc2626"
    ctx.fillText(winner, canvas.width / 2, 140)

    // Draw description
    ctx.font = "16px Arial"
    ctx.fillStyle = "#6b7280"
    ctx.fillText("この券は有効な賞品券です", canvas.width / 2, 180)

    // Draw dashed line
    ctx.setLineDash([5, 5])
    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(40, 200)
    ctx.lineTo(canvas.width - 40, 200)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw details
    const currentDate = new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const ticketNumber = Math.random().toString(36).substr(2, 9).toUpperCase()

    ctx.font = "14px Arial"
    ctx.fillStyle = "#6b7280"
    ctx.textAlign = "left"
    ctx.fillText("発行日:", 50, 240)
    ctx.textAlign = "right"
    ctx.fillText(currentDate, canvas.width - 50, 240)

    ctx.textAlign = "left"
    ctx.fillText("券番号:", 50, 270)
    ctx.textAlign = "right"
    ctx.font = "14px monospace"
    ctx.fillText(ticketNumber, canvas.width - 50, 270)

    ctx.font = "14px Arial"
    ctx.textAlign = "left"
    ctx.fillText("発行者:", 50, 300)
    ctx.textAlign = "right"
    ctx.fillText("ルーレットアプリ", canvas.width - 50, 300)

    // Draw bottom dashed line
    ctx.setLineDash([5, 5])
    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(40, 330)
    ctx.lineTo(canvas.width - 40, 330)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw footer text
    ctx.font = "12px Arial"
    ctx.fillStyle = "#9ca3af"
    ctx.textAlign = "center"
    ctx.fillText("※ この券は当選の証明として使用できます", canvas.width / 2, 360)

    // Draw celebration emoji
    ctx.font = "32px Arial"
    ctx.fillText("🎉", canvas.width / 2, 420)

    // Download the image
    const link = document.createElement("a")
    link.download = `${winner}_ticket.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const resetGame = () => {
    setWinner(null)
    setShowTicket(false)
    setIsSpinning(false)
    setShowCutIn(false)
    setInitialResult(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">🎰 ルーレットアプリ</h1>
              <p className="text-muted-foreground">ルーレットを回して素敵な賞品をゲットしよう！</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSettingsClick} disabled={isSpinning}>
                <Settings className="w-4 h-4 mr-2" />
                設定
              </Button>
              <Button variant="outline" size="sm" onClick={resetGame} disabled={isSpinning}>
                <RotateCcw className="w-4 h-4 mr-2" />
                リセット
              </Button>
            </div>
          </div>
        </div>
      </header>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">管理者認証</h3>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="合言葉を入力してください"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                />
                <div className="flex gap-2">
                  <Button onClick={handlePasswordSubmit} className="flex-1">
                    認証
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordModal(false)
                      setPassword("")
                    }}
                    className="flex-1"
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {showSettings && isAuthenticated && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">カットイン演出の設定</h3>
              <div className="space-y-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    画像または動画をアップロード
                  </Button>
                </div>

                {cutinMedia && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        現在の設定: {cutinMediaType === "image" ? "画像" : "動画"}
                      </span>
                      <Button variant="ghost" size="sm" onClick={removeCutinMedia}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      {cutinMediaType === "image" ? (
                        <img
                          src={cutinMedia || "/placeholder.svg"}
                          alt="カットイン画像"
                          className="max-w-full h-32 object-contain mx-auto"
                        />
                      ) : (
                        <video src={cutinMedia} className="max-w-full h-32 object-contain mx-auto" controls />
                      )}
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  ※ アップロードした画像や動画がカットイン演出で表示されます
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-1 gap-8">
          {/* Roulette Section */}
          <Card className="lg:col-span-1">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-8">
                <RouletteWheel prizes={prizes} isSpinning={isSpinning} winner={winner} />

                {showCutIn && (
                  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div className="max-w-4xl max-h-4xl w-full h-full flex items-center justify-center p-8">
                      {cutinMedia ? (
                        cutinMediaType === "image" ? (
                          <img
                            src={cutinMedia || "/placeholder.svg"}
                            alt="カットイン演出"
                            className="max-w-full max-h-full object-contain animate-pulse"
                          />
                        ) : (
                          <video src={cutinMedia} autoPlay muted className="max-w-full max-h-full object-contain" />
                        )
                      ) : (
                        <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-white text-6xl font-bold p-8 rounded-lg shadow-2xl animate-bounce">
                          🎉 カットイン！ 🎉
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-center space-y-4">
                  <Button
                    onClick={spinRoulette}
                    disabled={isSpinning || showCutIn}
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold"
                  >
                    {isSpinning ? "ルーレット回転中..." : showCutIn ? "カットイン中..." : "ルーレットを回す！"}
                  </Button>

                  {winner && !showCutIn && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-primary mb-2">
                          {winner === "はずれ" ? "😢 残念！" : "🎉 おめでとう！"}
                        </h2>
                        <p className="text-xl text-foreground">
                          {winner === "はずれ" ? "はずれでした..." : `${winner}が当たりました！`}
                        </p>
                      </div>

                      {winner !== "はずれ" && showTicket && (
                        <div className="space-y-4">
                          <div ref={ticketRef}>
                            <PrizeTicket prizeName={winner} />
                          </div>
                          <Button onClick={downloadTicket} className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            デジタル券をダウンロード
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-center">賞品一覧</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Array.from(new Set(prizes)).map((prize, index) => (
                      <Badge key={index} variant={prize === "ごちそう券" ? "default" : "secondary"}>
                        {prize} {prize === "ごちそう券" ? "(1個)" : `(${prizes.filter((p) => p === prize).length}個)`}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
