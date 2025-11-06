import { useState, useEffect } from 'react'
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
import { Copy, ExternalLink, Trash2, Loader2, QrCode, Eye } from 'lucide-react'
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
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading links...</span>
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No links created yet.</p>
        <p className="text-sm">Create your first short link above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">QR Code</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQR(null)}
              >
                ×
              </Button>
            </div>
            <div className="text-center">
              <div className="border rounded-lg p-4 bg-white inline-block">
                <QRCodeSVG
                  value={buildShortUrl(showQR)}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-mono">
                {buildShortUrl(showQR)}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => handleCopy(buildShortUrl(showQR), 'QR Code URL')}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy URL
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short URL</TableHead>
              <TableHead>Original URL</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {buildShortUrl(link.short_id)}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(buildShortUrl(link.short_id), 'Short URL')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => openLink(link.short_id)}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm truncate">
                      {truncateText(link.original_url, 40)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => handleCopy(link.original_url, 'Original URL')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <span>{link.click_count}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{formatDate(link.created_at)}</div>
                    {link.last_accessed && (
                      <div className="text-xs text-muted-foreground">
                        Last: {formatDate(link.last_accessed)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowQR(link.short_id)}
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(link.short_id)}
                      disabled={isDeleting === link.short_id}
                    >
                      {isDeleting === link.short_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {links.length > 5 && (
        <div className="text-center">
          <Button variant="outline" onClick={fetchLinks}>
            Refresh Links
          </Button>
        </div>
      )}
    </div>
  )
}