import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Company } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Warning, Clock } from '@phosphor-icons/react'

interface SubscriptionDebugProps {
  company: Company
  onExpireSubscription: () => void
  onRestoreSubscription: () => void
}

export function SubscriptionDebug({ company, onExpireSubscription, onRestoreSubscription }: SubscriptionDebugProps) {
  const isExpired = company.subscription.status === 'expired' || company.license.expiryDate < Date.now()

  return (
    <Card className="border-orange-500">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Warning size={16} weight="duotone" />
          Debug: Subscription Testing
        </CardTitle>
        <CardDescription className="text-xs">
          For testing payment and blocking features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs space-y-1">
          <div>Status: <Badge variant={isExpired ? 'destructive' : 'default'}>{company.subscription.status}</Badge></div>
          <div>Expires: {new Date(company.license.expiryDate).toLocaleString()}</div>
          <div>Now: {new Date().toLocaleString()}</div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={onExpireSubscription}
            disabled={isExpired}
            className="text-xs"
          >
            <Clock size={12} className="mr-1" />
            Expire Now
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={onRestoreSubscription}
            disabled={!isExpired}
            className="text-xs"
          >
            Restore
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
