import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-slate-600 dark:text-slate-300">This page could not be found.</p>
        <Link href="/" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Back to majingze.com
        </Link>
      </body>
    </html>
  );
}
