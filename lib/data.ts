import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact, FaHtml5, FaCss3Alt, FaNodeJs, FaGitAlt, FaPython, FaJava, FaAws, FaDocker, FaGithub, FaUnity } from "react-icons/fa";
import { BiLogoTypescript, BiLogoJavascript, BiLogoPostgresql, BiLogoTailwindCss, BiLogoSpringBoot, BiLogoFirebase } from "react-icons/bi";
import { TbBrandNextjs, TbBrandMongodb, TbBrandCpp, TbBrandCSharp, TbSql, TbBrandGolang } from "react-icons/tb";
import { SiMysql, SiSqlite, SiExpress, SiTensorflow } from "react-icons/si";
import { LuGraduationCap } from "react-icons/lu";
import lakeMinneImg from "@/public/corpcomment.png";
import roamyImg from "@/public/rmtdev.png";
import wordanalyticsImg from "@/public/wordanalytics.png";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "Yale University",
    location: "New Haven, CT",
    description:
      "M.S. in Computer Science with courses in Building Distributed Systems, Database Systems, Full Stack Web Programming, and User Interface Design.",
    icon: React.createElement(LuGraduationCap),
    date: "Expected May 2025",
  },
  {
    title: "Software Engineer Volunteer",
    location: "Silicon Valley Leadership Community",
    description:
      "Developed and maintained the SVLC website using React. Conducted analysis comparing third-party databases, and built the SVLC forum with Firebase for real-time data management.",
    icon: React.createElement(CgWorkAlt),
    date: "July 2024 - Oct 2024",
  },
  {
    title: "Software Engineer Intern",
    location: "eBaoTech International, Ltd., Shanghai",
    description:
      "Designed a pipeline for programming language translation using LLMs. Fine-tuned models including ChatGLM v2 with PyTorch and Hugging Face. Built insurance databases and trained models on AWS SageMaker.",
    icon: React.createElement(CgWorkAlt),
    date: "June 2023 - Aug 2023",
  },
  {
    title: "Software Engineer Intern",
    location: "nPlace, Ltd., Shanghai",
    description:
      "Developed adaptive downsampling for data sensor converters, reducing thread pressure while maintaining accuracy. Implemented Bresenham's algorithm in 3D and contributed to the Zaichang 3D scanning software.",
    icon: React.createElement(CgWorkAlt),
    date: "June 2022 - Aug 2022",
  },
  {
    title: "University of Southern California",
    location: "Los Angeles, CA",
    description:
      "B.S./B.A. Double Major in Computer Science (Games) and Computational and Applied Mathematics.",
    icon: React.createElement(LuGraduationCap),
    date: "May 2024",
  },
] as const;

export const projectsData = [
  {
    title: "Lake Minnewaska",
    description:
      "A fishing simulator game developed in Unity. I served as the Gameplay and AI engineer, designing fishing mechanics, fish behavior AI using behavior trees, and key gameplay features.",
    tags: ["Unity", "C#", "Game AI", "State Machines", "Behavior Trees", "Pathfinding"],
    imageUrl: lakeMinneImg,
  },
  {
    title: "Roamy Trip",
    description:
      "A full-stack application for hotel discovery and travel planning with social features. Provides an interactive map showing hotel locations worldwide, with review sharing and friend connections.",
    tags: ["React Native", "Expo", "Node.js", "Express", "Mobile Development"],
    imageUrl: roamyImg,
  },
  {
    title: "Word Analytics",
    description:
      "A public web app for quick analytics on text. It shows word count, character count and social media post limits.",
    tags: ["React", "Next.js", "SQL", "Tailwind", "Framer"],
    imageUrl: wordanalyticsImg,
  },
] as const;

export const skillsData = [
  {
    name: "C++",
    icon: React.createElement(TbBrandCpp),
  },
  {
    name: "C#",
    icon: React.createElement(TbBrandCSharp),
  },
  {
    name: "C",
    icon: React.createElement(CgWorkAlt),
  },
  {
    name: "Java",
    icon: React.createElement(FaJava),
  },
  {
    name: "Go",
    icon: React.createElement(TbBrandGolang),
  },
  {
    name: "SQL",
    icon: React.createElement(TbSql),
  },
  {
    name: "JavaScript",
    icon: React.createElement(BiLogoJavascript),
  },
  {
    name: "HTML",
    icon: React.createElement(FaHtml5),
  },
  {
    name: "CSS",
    icon: React.createElement(FaCss3Alt),
  },
  {
    name: "Python",
    icon: React.createElement(FaPython),
  },
  {
    name: "React",
    icon: React.createElement(FaReact),
  },
  {
    name: "Spring Boot",
    icon: React.createElement(BiLogoSpringBoot),
  },
  {
    name: "MySQL",
    icon: React.createElement(SiMysql),
  },
  {
    name: "SQLite",
    icon: React.createElement(SiSqlite),
  },
  {
    name: "AWS",
    icon: React.createElement(FaAws),
  },
  {
    name: "GitHub",
    icon: React.createElement(FaGithub),
  },
  {
    name: "TensorFlow",
    icon: React.createElement(SiTensorflow),
  },
  {
    name: "Firebase",
    icon: React.createElement(BiLogoFirebase),
  },
  {
    name: "Docker",
    icon: React.createElement(FaDocker),
  },
  {
    name: "Unity",
    icon: React.createElement(FaUnity),
  },
] as const;
