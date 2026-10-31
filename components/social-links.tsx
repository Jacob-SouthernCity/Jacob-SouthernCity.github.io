import { FaGithub, FaLinkedin } from "react-icons/fa";

export const primaryButtonClassName =
  "group bg-gradient-teal flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-medium text-white shadow-md transition hover:scale-105 focus-visible:scale-105 active:scale-100 sm:w-auto";

const secondaryButtonClassName =
  "flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 shadow-md transition hover:scale-105 hover:text-indigo-600 focus-visible:scale-105 active:scale-100 sm:flex-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-indigo-400";

type SocialLinksProps = {
  linkedIn: string;
  gitHub: string;
};

export default function SocialLinks({ linkedIn, gitHub }: SocialLinksProps) {
  return (
    <div className="flex w-full gap-3 sm:w-auto sm:gap-4">
      <a className={secondaryButtonClassName} href={linkedIn} target="_blank" rel="noopener noreferrer">
        <FaLinkedin aria-hidden />
        LinkedIn
      </a>
      <a className={secondaryButtonClassName} href={gitHub} target="_blank" rel="noopener noreferrer">
        <FaGithub aria-hidden />
        GitHub
      </a>
    </div>
  );
}
