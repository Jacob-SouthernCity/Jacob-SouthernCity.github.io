
export default function Footer() {
  return (
    <footer className="mb-24 px-4 sm:mb-10 text-center text-slate-500 dark:text-slate-400">
      <small className="mb-2 block text-xs">
        &copy; {new Date().getFullYear()} Jingze Ma. All rights reserved.
      </small>
      <p className="text-xs">
        <span className="font-semibold">About this website:</span> built with
        Next.js, React, TypeScript, Tailwind CSS and Motion, hosted on
        Vercel.
      </p>
    </footer>
  );
}
