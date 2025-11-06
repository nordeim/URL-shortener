import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { buildShortUrl, copyToClipboard, generateSecureId, isValidUrl, normalizeUrl, sanitizeUrl } from '@/lib/utils'
import { QRCodeSVG } from 'qrcode.react'
import { 
  Copy, 
  ExternalLink, 
  Loader2, 
  QrCode, 
  Sparkles, 
  Link as LinkIcon,
  CheckCircle
} from 'lucide-react'
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
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
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
      const { data: newLink, error: insertError } = await (supabase as any)
        .from('links')
        .insert({
          original_url: sanitizedUrl,
          short_id: shortId,
          custom_alias: !!data.customAlias,
          metadata: {
            created_at: new Date().toISOString(),
            user_agent: navigator.userAgent || '',
          },
        })
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

  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      // Set temporary copied state
      setCopiedStates(prev => ({ ...prev, [text]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [text]: false }))
      }, 2000)
      
      toast({
        title: 'Copied!',
        description: `${type} copied to clipboard`,
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
    setCopiedStates({})
  }

  const handleRandomAlias = () => {
    const randomAlias = generateSecureId(6)
    setValue('customAlias', randomAlias)
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* URL Input */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="url" className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-[var(--primary-500)]" />
            Long URL
          </label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            {...register('url')}
            className={`input-modern ${errors.url ? 'input-error' : ''}`}
          />
          <AnimatePresence>
            {errors.url && (
              <motion.p 
                className="text-sm text-red-500 flex items-center gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.url.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Custom Alias Input */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="customAlias" className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--primary-500)]" />
            Custom Alias <span className="text-[var(--text-muted)] font-normal">(optional)</span>
          </label>
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                id="customAlias"
                type="text"
                placeholder={`auto-${generateSecureId(4)}`}
                {...register('customAlias')}
                className={`input-modern ${errors.customAlias ? 'input-error' : ''}`}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleRandomAlias}
              className="btn-secondary px-4 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Random
            </Button>
          </div>
          <AnimatePresence>
            {errors.customAlias && (
              <motion.p 
                className="text-sm text-red-500 flex items-center gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.customAlias.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full text-lg py-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="loading-spinner mr-3" />
                Shortening URL...
              </>
            ) : (
              <>
                <LinkIcon className="w-5 h-5 mr-3" />
                Shorten URL
              </>
            )}
          </Button>
        </motion.div>
      </form>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="card-modern border-[var(--primary-100)] bg-gradient-to-br from-[var(--primary-50)] to-[var(--surface-primary)]">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-[var(--primary-600)] flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Your Short Link is Ready!
                </CardTitle>
                <CardDescription className="text-[var(--text-secondary)]">
                  URL shortened successfully! Copy and share your new short link.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Short URL */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Short URL
                  </label>
                  <div className="flex space-x-3">
                    <Input
                      value={result.shortUrl}
                      readOnly
                      className="input-modern font-mono text-sm bg-[var(--surface-secondary)]"
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopy(result.shortUrl, 'Short URL')}
                        className="btn-secondary"
                      >
                        {copiedStates[result.shortUrl] ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(result.shortUrl, '_blank')}
                        className="btn-secondary"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Original URL */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Original URL
                  </label>
                  <div className="flex space-x-3">
                    <Input
                      value={normalizeUrl(result.originalUrl)}
                      readOnly
                      className="input-modern font-mono text-xs bg-[var(--surface-secondary)]"
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopy(normalizeUrl(result.originalUrl), 'Original URL')}
                        className="btn-secondary"
                      >
                        {copiedStates[normalizeUrl(result.originalUrl)] ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowQR(!showQR)}
                      className="btn-secondary w-full"
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      {showQR ? 'Hide' : 'Show'} QR Code
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="button" variant="outline" onClick={handleReset} className="btn-secondary">
                      Create Another
                    </Button>
                  </motion.div>
                </div>

                {/* QR Code */}
                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-center pt-6"
                    >
                      <div className="border-2 border-[var(--border-primary)] rounded-2xl p-6 bg-white shadow-lg">
                        <QRCodeSVG
                          value={result.shortUrl}
                          size={200}
                          level="M"
                          includeMargin={true}
                        />
                        <p className="text-center text-sm text-[var(--text-muted)] mt-4 font-medium">
                          Scan to open link
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      <motion.div 
        className="text-center text-sm text-[var(--text-muted)] space-y-3 p-6 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-primary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="font-medium text-[var(--text-primary)]">
          <Sparkles className="inline w-4 h-4 mr-1" />
          Pro Tips:
        </p>
        <ul className="text-xs space-y-2 max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 bg-[var(--primary-500)] rounded-full mt-2 flex-shrink-0"></span>
            Custom aliases must be 4-10 characters, alphanumeric only
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 bg-[var(--primary-500)] rounded-full mt-2 flex-shrink-0"></span>
            Leave alias blank for an auto-generated short URL
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 bg-[var(--primary-500)] rounded-full mt-2 flex-shrink-0"></span>
            All URLs are validated and sanitized for security
          </li>
        </ul>
      </motion.div>
    </motion.div>
  )
}