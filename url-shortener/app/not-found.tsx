// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-error mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Link Not Found</h2>
        <p className="text-lg text-base-content/70 mb-8">
          The short link you are looking for does not exist or has been deleted.
        </p>
        <Link href="/" className="btn btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
