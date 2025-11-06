import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { buildShortUrl, copyToClipboard, generateSecureId, isValidUrl, normalizeUrl, sanitizeUrl } from '@/lib/utils'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, ExternalLink, Loader2, QrCode } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

// Form validation schema
const urlFormSchema = z.object({
  url: z.string().min(1, 'URL is required').refine(isValidUrl, 'Please enter a valid URL'),
  customAlias: z.string().optional().refine(
    (alias) => !alias || /^[a-zA-Z0-9]{4,10}$/.test(alias),
    'Custom alias must be 4-10 characters, alphanumeric only'
  ),
})

type UrlFormData = z.infer<typeof urlFormSchema>

interface ShortenedLink {
  shortId: string
  originalUrl: string
  shortUrl: string
  customAlias: boolean
  createdAt: string
}

export function UrlShortenerForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ShortenedLink | null>(null)
  const [showQR, setShowQR] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UrlFormData>({
    resolver: zodResolver(urlFormSchema),
  })

  const customAlias = watch('customAlias')

  const generateShortId = async (customAlias?: string): Promise<string> => {
    if (customAlias) {
      // Check if custom alias already exists
      const { data: existingLink } = await supabase
        .from('links')
        .select('short_id')
        .eq('short_id', customAlias.toLowerCase())
        .single()

      if (existingLink) {
        throw new Error('Custom alias already exists')
      }
      return customAlias.toLowerCase()
    } else {
      // Generate random short ID
      let attempts = 0
      const maxAttempts = 10

      do {
        const shortId = generateSecureId(6)

        const { data: existingLink } = await supabase
          .from('links')
          .select('short_id')
          .eq('short_id', shortId)
          .single()

        if (!existingLink) {
          return shortId
        }

        attempts++
      } while (attempts < maxAttempts)

      // Fallback to longer ID if all short ones are taken
      return generateSecureId(8)
    }
  }

  const onSubmit = async (data: UrlFormData) => {
    setIsLoading(true)
    setResult(null)

    try {
      // Sanitize and normalize the URL
      const sanitizedUrl = sanitizeUrl(normalizeUrl(data.url))

      // Generate short ID
      const shortId = await generateShortId(data.customAlias)

      // Insert the new link
      const { data: newLink, error: insertError } = await supabase
        .from('links')
        .insert({
          original_url: sanitizedUrl,
          short_id: shortId,
          custom_alias: !!data.customAlias,
          metadata: {
            created_at: new Date().toISOString(),
            user_agent: navigator.userAgent || '',
          },
        } as any)
        .select('id, created_at')
        .single()

      if (insertError) {
        throw new Error('Failed to create short link')
      }

      // Build the complete short URL
      const baseUrl = window.location.origin
      const shortUrl = `${baseUrl}/${shortId}`

      const shortenedLink: ShortenedLink = {
        shortId,
        originalUrl: sanitizedUrl,
        shortUrl,
        customAlias: !!data.customAlias,
        createdAt: new Date().toISOString(),
      }

      setResult(shortenedLink)
      setShowQR(false)
      
      toast({
        title: 'URL shortened successfully!',
        description: 'Your short link is ready to share.',
      })

    } catch (error) {
      console.error('Error shortening URL:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to shorten URL',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      toast({
        title: 'Copied!',
        description: 'Link copied to clipboard',
      })
    } else {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  const handleReset = () => {
    reset()
    setResult(null)
    setShowQR(false)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* URL Input */}
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium">
            Long URL
          </label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            {...register('url')}
            className={errors.url ? 'border-destructive' : ''}
          />
          {errors.url && (
            <p className="text-sm text-destructive">{errors.url.message}</p>
          )}
        </div>

        {/* Custom Alias Input */}
        <div className="space-y-2">
          <label htmlFor="customAlias" className="text-sm font-medium">
            Custom Alias <span className="text-muted-foreground">(optional)</span>
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                id="customAlias"
                type="text"
                placeholder={`auto-${generateSecureId(4)}`}
                {...register('customAlias')}
                className={errors.customAlias ? 'border-destructive' : ''}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const randomAlias = generateSecureId(6)
                const form = document.getElementById('customAlias') as HTMLInputElement
                if (form) {
                  form.value = randomAlias
                }
              }}
            >
              Random
            </Button>
          </div>
          {errors.customAlias && (
            <p className="text-sm text-destructive">{errors.customAlias.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Shortening...
            </>
          ) : (
            'Shorten URL'
          )}
        </Button>
      </form>

      {/* Result */}
      {result && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Your Short Link</CardTitle>
            <CardDescription>
              Your URL has been successfully shortened!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Short URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Short URL</label>
              <div className="flex space-x-2">
                <Input
                  value={result.shortUrl}
                  readOnly
                  className="font-mono text-sm bg-background"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(result.shortUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(result.shortUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Original URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Original URL</label>
              <div className="flex space-x-2">
                <Input
                  value={normalizeUrl(result.originalUrl)}
                  readOnly
                  className="font-mono text-sm bg-background text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(normalizeUrl(result.originalUrl))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQR(!showQR)}
                className="flex-1"
              >
                <QrCode className="mr-2 h-4 w-4" />
                {showQR ? 'Hide' : 'Show'} QR Code
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Create Another
              </Button>
            </div>

            {/* QR Code */}
            {showQR && (
              <div className="flex justify-center pt-4">
                <div className="border rounded-lg p-4 bg-white">
                  <QRCodeSVG
                    value={result.shortUrl}
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Scan to open link
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>
          <strong>Tips:</strong>
        </p>
        <ul className="text-xs space-y-1">
          <li>• Custom aliases must be 4-10 characters, alphanumeric only</li>
          <li>• Leave alias blank for an auto-generated short URL</li>
          <li>• All URLs are validated and sanitized for security</li>
        </ul>
      </div>
    </div>
  )
}