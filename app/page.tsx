"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RouletteWheel } from "@/components/roulette-wheel"
import { PrizeTicket } from "@/components/prize-ticket"
import { Settings, Download, RotateCcw, Plus, X } from "lucide-react"

export default function RoulettePage() {
  const [prizes, setPrizes] = useState([
    "ごちそう券",
    "コーヒー券",
    "デザート券",
    "お買い物券",
    "マッサージ券",
    "映画券",
    "温泉券",
    "はずれ",
  ])
  const [newPrize, setNewPrize] = useState("")
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showTicket, setShowTicket] = useState(false)
  const ticketRef = useRef<HTMLDivElement>(null)

  const addPrize = () => {
    if (newPrize.trim() && !prizes.includes(newPrize.trim())) {
      setPrizes([...prizes, newPrize.trim()])
      setNewPrize("")
    }
  }

  const removePrize = (index: number) => {
    if (prizes.length > 2) {
      setPrizes(prizes.filter((_, i) => i !== index))
    }
  }

  const spinRoulette = () => {
    if (isSpinning || prizes.length === 0) return

    setIsSpinning(true)
    setWinner(null)
    setShowTicket(false)

    // ランダムに賞品を選択
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * prizes.length)
      const selectedPrize = prizes[randomIndex]
      setWinner(selectedPrize)
      setIsSpinning(false)

      // 当選券を表示（はずれ以外）
      if (selectedPrize !== "はずれ") {
        setTimeout(() => setShowTicket(true), 1000)
      }
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
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          {showSettings && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>賞品設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="new-prize">新しい賞品を追加</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="new-prize"
                      value={newPrize}
                      onChange={(e) => setNewPrize(e.target.value)}
                      placeholder="例: お食事券"
                      onKeyPress={(e) => e.key === "Enter" && addPrize()}
                    />
                    <Button onClick={addPrize} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>現在の賞品一覧</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {prizes.map((prize, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {prize}
                        {prizes.length > 2 && (
                          <button onClick={() => removePrize(index)} className="ml-1 hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Roulette Section */}
          <Card className={showSettings ? "lg:col-span-2" : "lg:col-span-3"}>
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-8">
                <RouletteWheel prizes={prizes} isSpinning={isSpinning} winner={winner} />

                <div className="text-center space-y-4">
                  <Button
                    onClick={spinRoulette}
                    disabled={isSpinning || prizes.length === 0}
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold"
                  >
                    {isSpinning ? "ルーレット回転中..." : "ルーレットを回す！"}
                  </Button>

                  {winner && (
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
