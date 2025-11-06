import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { buildShortUrl, copyToClipboard, formatDate, truncateText } from '@/lib/utils'
import { 
  Copy, 
  ExternalLink, 
  Trash2, 
  Loader2, 
  QrCode, 
  Eye,
  CheckCircle,
  Link as LinkIcon,
  Calendar,
  MousePointer,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '@/lib/supabase'

interface Link {
  id: number
  created_at: string
  original_url: string
  short_id: string
  click_count: number
  custom_alias: boolean
  last_accessed: string | null
}

export function LinkTable() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [showQR, setShowQR] = useState<string | null>(null)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const { toast } = useToast()

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('id, created_at, original_url, short_id, click_count, custom_alias, last_accessed')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        throw error
      }

      setLinks(data || [])
    } catch (error) {
      console.error('Error fetching links:', error)
      toast({
        title: 'Error',
        description: 'Failed to load links',
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

  const handleDelete = async (shortId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return
    }

    setIsDeleting(shortId)
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('short_id', shortId)

      if (error) {
        throw error
      }

      setLinks(links.filter(link => link.short_id !== shortId))
      toast({
        title: 'Deleted',
        description: 'Link has been deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting link:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete link',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const openLink = (shortId: string) => {
    window.open(buildShortUrl(shortId), '_blank')
  }

  if (isLoading) {
    return (
      <motion.div 
        className="flex items-center justify-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <Loader2 className="loading-spinner w-8 h-8 mx-auto mb-4 text-[var(--primary-500)]" />
          <span className="text-[var(--text-secondary)] font-medium">Loading your links...</span>
        </div>
      </motion.div>
    )
  }

  if (links.length === 0) {
    return (
      <motion.div 
        className="text-center py-16 text-[var(--text-muted)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto">
          <LinkIcon className="w-16 h-16 mx-auto mb-4 text-[var(--border-secondary)]" />
          <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">No links yet</h3>
          <p className="text-[var(--text-muted)] mb-6">
            Create your first short link above to get started!
          </p>
          <motion.div
            className="w-2 h-2 bg-[var(--primary-500)] rounded-full mx-auto animate-pulse"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          />
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQR(null)}
          >
            <motion.div
              className="bg-[var(--surface-primary)] p-8 rounded-2xl max-w-sm w-full mx-4 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">QR Code</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQR(null)}
                  className="btn-ghost"
                >
                  ×
                </Button>
              </div>
              <div className="text-center">
                <div className="border-2 border-[var(--border-primary)] rounded-2xl p-6 bg-white inline-block mb-4 shadow-lg">
                  <QRCodeSVG
                    value={buildShortUrl(showQR)}
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-[var(--text-muted)] font-mono mb-4 break-all">
                  {buildShortUrl(showQR)}
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(buildShortUrl(showQR), 'QR Code URL')}
                    className="btn-secondary w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy URL
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links Table */}
      <motion.div
        className="table-modern"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Table>
          <TableHeader>
            <TableRow className="table-header hover:bg-[var(--surface-secondary)]">
              <TableHead className="text-[var(--text-primary)] font-semibold">Short URL</TableHead>
              <TableHead className="text-[var(--text-primary)] font-semibold">Original URL</TableHead>
              <TableHead className="text-[var(--text-primary)] font-semibold">Clicks</TableHead>
              <TableHead className="text-[var(--text-primary)] font-semibold">Created</TableHead>
              <TableHead className="text-[var(--text-primary)] font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link, index) => (
              <motion.tr
                key={link.id}
                className="table-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <TableCell className="table-cell font-mono">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-[var(--primary-600)] font-medium">
                      {buildShortUrl(link.short_id)}
                    </span>
                    <div className="flex space-x-1">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 btn-ghost"
                          onClick={() => handleCopy(buildShortUrl(link.short_id), 'Short URL')}
                        >
                          {copiedStates[buildShortUrl(link.short_id)] ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 btn-ghost"
                          onClick={() => openLink(link.short_id)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="table-cell max-w-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-[var(--text-secondary)] truncate">
                      {truncateText(link.original_url, 40)}
                    </span>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 btn-ghost flex-shrink-0"
                        onClick={() => handleCopy(link.original_url, 'Original URL')}
                      >
                        {copiedStates[link.original_url] ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
                <TableCell className="table-cell">
                  <div className="flex items-center space-x-2">
                    <MousePointer className="h-4 w-4 text-[var(--primary-500)]" />
                    <span className="font-semibold text-[var(--text-primary)]">{link.click_count}</span>
                  </div>
                </TableCell>
                <TableCell className="table-cell">
                  <div className="text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3 w-3 text-[var(--text-muted)]" />
                      <span className="text-[var(--text-secondary)]">{formatDate(link.created_at)}</span>
                    </div>
                    {link.last_accessed && (
                      <div className="text-xs text-[var(--text-muted)]">
                        Last: {formatDate(link.last_accessed)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="table-cell text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 btn-ghost"
                        onClick={() => setShowQR(link.short_id)}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDelete(link.short_id)}
                        disabled={isDeleting === link.short_id}
                      >
                        {isDeleting === link.short_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Refresh Button */}
      {links.length > 0 && (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" onClick={fetchLinks} className="btn-secondary">
              <ArrowRight className="mr-2 h-4 w-4" />
              Refresh Links
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}