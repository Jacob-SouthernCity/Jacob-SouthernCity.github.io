import React from "react";

type SectionHeadingProps = {
  children: React.ReactNode;
};

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="text-4xl font-bold capitalize mb-10 text-center relative">
      <span className="text-gradient-teal">{children}</span>
      <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-teal-400 to-indigo-600 rounded-full"></span>
    </h2>
  );
}
