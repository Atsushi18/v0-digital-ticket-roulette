"use client"

interface PrizeTicketProps {
  prizeName: string
}

export function PrizeTicket({ prizeName }: PrizeTicketProps) {
  const currentDate = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const ticketNumber = Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-primary to-accent p-8 rounded-lg shadow-2xl border-4 border-primary-foreground">
      <div className="bg-card rounded-lg p-6 text-center space-y-4">
        <div className="border-b-2 border-dashed border-border pb-4">
          <h2 className="text-2xl font-bold text-primary mb-2">🎫 デジタル券</h2>
          <div className="text-4xl font-bold text-foreground mb-2">{prizeName}</div>
          <p className="text-muted-foreground">この券は有効な賞品券です</p>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>発行日:</span>
            <span>{currentDate}</span>
          </div>
          <div className="flex justify-between">
            <span>券番号:</span>
            <span className="font-mono">{ticketNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>発行者:</span>
            <span>原井川　陸　feat.我伊野　司</span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-border pt-4 text-xs text-muted-foreground">
          <p>※ この券は当選の証明として使用できます</p>
          <p>原井川陸に食事代金を肩代わりさせることができます</p>
          <div className="mt-2 text-2xl">🎉</div>
        </div>
      </div>
    </div>
  )
}
