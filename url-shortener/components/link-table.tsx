// components/link-table.tsx
'use client';

import { useEffect, useState } from 'react';
import { Link as LinkType } from '@/lib/supabase';
import { formatDate, timeAgo, truncateUrl } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './ui/table';

interface LinkTableProps {
  refreshTrigger?: number;
  showToast: (message: string, type: 'success' | 'error') => void;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function LinkTable({ refreshTrigger, showToast }: LinkTableProps) {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchLinks = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/links?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (!response.ok) throw new Error('Failed to fetch links');

      const data = await response.json();
      setLinks(data.links);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching links:', error);
      showToast('Failed to load links', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks(pagination.currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, sortBy, sortOrder]);

  const handleDelete = async (shortId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`/api/links/delete?shortId=${shortId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete link');

      showToast('Link deleted successfully', 'success');
      fetchLinks(pagination.currentPage);
    } catch (error) {
      console.error('Error deleting link:', error);
      showToast('Failed to delete link', 'error');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard', 'success');
    } catch (error) {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/70">No links yet. Create your first one above!</p>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort('short_id')}
            >
              Short ID {getSortIcon('short_id')}
            </TableHead>
            <TableHead>Original URL</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort('click_count')}
            >
              Clicks {getSortIcon('click_count')}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort('created_at')}
            >
              Created {getSortIcon('created_at')}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort('last_accessed')}
            >
              Last Accessed {getSortIcon('last_accessed')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell>
                <button
                  onClick={() =>
                    copyToClipboard(`${baseUrl}/${link.short_id}`)
                  }
                  className="font-mono text-primary hover:underline"
                >
                  {link.short_id}
                </button>
              </TableCell>
              <TableCell>
                <a
                  href={link.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-sm"
                  title={link.original_url}
                >
                  {truncateUrl(link.original_url, 40)}
                </a>
              </TableCell>
              <TableCell>{link.click_count}</TableCell>
              <TableCell className="text-sm">
                <span title={formatDate(link.created_at)}>
                  {timeAgo(link.created_at)}
                </span>
              </TableCell>
              <TableCell className="text-sm">
                {link.last_accessed ? (
                  <span title={formatDate(link.last_accessed)}>
                    {timeAgo(link.last_accessed)}
                  </span>
                ) : (
                  <span className="text-base-content/50">Never</span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="error"
                  onClick={() => handleDelete(link.short_id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            onClick={() => fetchLinks(pagination.currentPage - 1)}
            disabled={!pagination.hasPreviousPage}
          >
            Previous
          </Button>
          <span className="px-4 py-2">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            size="sm"
            onClick={() => fetchLinks(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
