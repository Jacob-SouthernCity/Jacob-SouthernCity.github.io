import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact, FaHtml5, FaCss3Alt, FaNodeJs, FaGitAlt, FaPython, FaJava, FaAws, FaDocker, FaGithub, FaUnity } from "react-icons/fa";
import { BiLogoTypescript, BiLogoJavascript, BiLogoPostgresql, BiLogoTailwindCss, BiLogoSpringBoot, BiLogoFirebase } from "react-icons/bi";
import { TbBrandNextjs, TbBrandMongodb, TbBrandCpp, TbBrandCSharp, TbSql, TbBrandGolang } from "react-icons/tb";
import { SiMysql, SiSqlite, SiExpress, SiTensorflow, SiPerforce, SiC } from "react-icons/si";
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
    title: "B.S. in Computer Science (Games)",
    location: "University of Southern California, Los Angeles, CA",
    description:
      "Specialized in game development with courses in Game Engine Architecture, Game Physics, Immersive Game Design, and AI for Games. Developed multiple game projects using Unity and Unreal Engine.",
    icon: React.createElement(LuGraduationCap),
    date: "Aug 2020 - May 2024",
  },
  {
    title: "B.A. in Computational and Applied Mathematics",
    location: "University of Southern California, Los Angeles, CA",
    description:
      "Focused on mathematical foundations and their applications to computer science, with coursework in Discrete Mathematics, Numerical Analysis, Machine Learning and Statistics.",
    icon: React.createElement(LuGraduationCap),
    date: "Aug 2020 - May 2024",
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
    title: "Software Engineer Intern",
    location: "eBaoTech International, Ltd., Shanghai",
    description:
      "Designed a pipeline for programming language translation using LLMs. Fine-tuned models including ChatGLM v2 with PyTorch and Hugging Face. Built insurance databases and trained models on AWS SageMaker.",
    icon: React.createElement(CgWorkAlt),
    date: "June 2023 - Aug 2023",
  },
  {
    title: "M.S. in Computer Science",
    location: "Yale University, New Haven, CT",
    description:
      "Pursuing advanced studies with courses in Building Distributed Systems, Database Systems, Full Stack Web Programming, and User Interface Design. Research focuses on game development techniques and artificial intelligence.",
    icon: React.createElement(LuGraduationCap),
    date: "Aug 2024 - May 2025 (Expected)",
  },
] as const;

export const projectsData = [
  {
    title: "Lake Minnewaska",
    description:
      "A fishing simulator game developed in Unity. I served as the Gameplay and AI engineer, designing fishing mechanics, fish behavior AI using behavior trees, and key gameplay features.",
    tags: ["Unity", "C#", "Game AI", "Perforce"],
    imageUrl: lakeMinneImg,
    videoUrl: "https://video.cloudflare.steamstatic.com/store_trailers/257021477/movie480_vp9.webm?t=1716053340",
    links: [
      {
        icon: "FaSteam",
        url: "https://store.steampowered.com/app/2858430/Lake_Minnewaska/",
        label: "View on Steam"
      }
    ]
  },
  {
    title: "Roamy Trip",
    description:
      "A full-stack application for hotel discovery and travel planning with social features. Provides an interactive map showing hotel locations worldwide, with review sharing and friend connections.",
    tags: ["React Native", "Expo", "Node.js", "Express", "Mobile Development"],
    imageUrl: roamyImg,
    links: []
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
    icon: React.createElement(SiC),
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
  {
    name: "Perforce",
    icon: React.createElement(SiPerforce),
  },
] as const;
