import { createElement } from "react";
import { FaReact, FaHtml5, FaCss3Alt, FaPython, FaJava, FaAws, FaDocker, FaGithub, FaUnity, FaApple, FaSteam } from "react-icons/fa";
import { BiLogoJavascript, BiLogoSpringBoot, BiLogoFirebase } from "react-icons/bi";
import { TbBrandNextjs, TbBrandCpp, TbBrandCSharp, TbSql, TbBrandGolang } from "react-icons/tb";
import {
  SiMysql,
  SiSqlite,
  SiExpress,
  SiTensorflow,
  SiPerforce,
  SiC,
  SiSwift,
  SiKotlin,
  SiFlutter,
  SiDart,
  SiTypescript,
  SiNodedotjs,
  SiPytorch,
  SiAndroid,
} from "react-icons/si";
import roamyImg from "@/public/roamy.jpg";
import kazumiTvImg from "@/public/kazumi-tv.jpg";
import psnCardImg from "@/public/psn-card.svg";
import type { ExperienceData, ProjectData } from "./types";

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

export const contactLinks = {
  email: "jingzema2001@gmail.com",
  linkedIn: "https://www.linkedin.com/in/jingze-ma/",
  gitHub: "https://github.com/Jacob-SouthernCity",
} as const;

export const experiencesData: readonly ExperienceData[] = [
  {
    id: "smule",
    kind: "work",
    title: "Software Engineer",
    organization: "Smule",
    description:
      "Full-time engineer working across Smule's products: building features for the smule.com web app and the Smule Sing apps on iOS and Android, and supporting the backend services behind them.",
    start: "2026-07",
    end: null,
  },
  {
    id: "smule-intern",
    kind: "work",
    title: "Machine Learning Engineer Intern",
    organization: "Smule",
    description:
      "Joined Smule as a machine learning engineering intern before converting to a full-time software engineering role.",
    start: "2026-04",
    end: "2026-07",
  },
  {
    id: "vestmark",
    kind: "work",
    title: "Associate Software Engineer",
    organization: "Vestmark Inc.",
    shortName: "Vestmark",
    location: "Wakefield, MA",
    description:
      "Built backend APIs for portfolio rebalancing and related features on VestmarkONE, Vestmark's wealth management platform.",
    start: "2025-06",
    end: "2026-01",
  },
  {
    id: "yale",
    kind: "education",
    title: "M.S. in Computer Science",
    organization: "Yale University",
    shortName: "Yale",
    location: "New Haven, CT",
    gpa: "4.0/4.0",
    description:
      "Coursework in Building Distributed Systems, Database Systems, Full Stack Web Programming, and User Interface Design.",
    start: "2024-08",
    end: "2025-05",
  },
  {
    id: "ebaotech",
    kind: "work",
    title: "Software Engineer Intern",
    organization: "eBaoTech International, Ltd.",
    shortName: "eBaoTech",
    location: "Shanghai",
    description:
      "Designed a pipeline for programming language translation using LLMs. Fine-tuned models including ChatGLM v2 with PyTorch and Hugging Face. Built insurance databases and trained models on AWS SageMaker.",
    start: "2023-06",
    end: "2023-08",
  },
  {
    id: "nplace",
    kind: "work",
    title: "Software Engineer Intern",
    organization: "nPlace, Ltd.",
    shortName: "nPlace",
    location: "Shanghai",
    description:
      "Developed adaptive downsampling for data sensor converters, reducing thread pressure while maintaining accuracy. Implemented Bresenham's algorithm in 3D and contributed to the Zaichang 3D scanning software.",
    start: "2022-06",
    end: "2022-08",
  },
  {
    id: "usc-cs",
    kind: "education",
    title: "B.S. in Computer Science (Games)",
    organization: "University of Southern California",
    shortName: "USC",
    location: "Los Angeles, CA",
    gpa: "3.94/4.00",
    description:
      "Graduated Summa Cum Laude. Game development coursework in Game Engines, Game Physics, Immersive Game Design, and AI for Games.",
    start: "2021-08",
    end: "2024-05",
  },
  {
    id: "usc-math",
    kind: "education",
    title: "B.A. in Computational and Applied Mathematics",
    organization: "University of Southern California",
    shortName: "USC",
    location: "Los Angeles, CA",
    gpa: "3.94/4.00",
    description:
      "Second major alongside Computer Science, with coursework in Numerical Analysis, Machine Learning, Statistics, and Linear Algebra.",
    start: "2021-08",
    end: "2024-05",
  },
  {
    id: "rochester",
    kind: "education",
    title: "B.S. in Computer Science",
    organization: "University of Rochester",
    shortName: "Rochester",
    location: "Rochester, NY",
    gpa: "4.0/4.0",
    description:
      "Took Introduction to Computer Science (CSC 171) and Data Structures and Algorithms (CSC 172), both taught in Java, before transferring to USC.",
    start: "2020-08",
    end: "2021-07",
  },
];

export const projectsData: readonly ProjectData[] = [
  {
    title: "PSN README Card",
    description:
      "A live PlayStation Network trophy card for GitHub profiles. A small serverless function on Vercel renders trophy level, trophy counts, PS Plus status, and recent games as an SVG that READMEs embed like any image.",
    tags: ["TypeScript", "Serverless", "Vercel", "SVG"],
    imageUrl: psnCardImg,
    links: [
      {
        icon: FaGithub,
        url: "https://github.com/Jacob-SouthernCity/psn-readme-card",
        label: "View on GitHub",
      },
    ],
  },
  {
    title: "Kazumi TV",
    description:
      "An Android TV and Google TV port of the open-source Kazumi anime app. Adds full remote-control focus navigation, D-pad browsing of comments, a TV launcher banner, and network fallbacks, while leaving phone and desktop behaviour unchanged.",
    tags: ["Flutter", "Dart", "Android TV", "Open Source"],
    imageUrl: kazumiTvImg,
    links: [
      {
        icon: FaGithub,
        url: "https://github.com/Jacob-SouthernCity/Kazumi-TV",
        label: "View on GitHub",
      },
    ],
  },
  {
    title: "Lake Minnewaska",
    description:
      "A fishing simulator game developed in Unity with a team of 30. I served as the Gameplay and AI engineer, designing fishing mechanics, fish behavior AI using behavior trees, and key gameplay features.",
    tags: ["Unity", "C#", "Game AI", "Perforce"],
    imageUrl: null,
    video: {
      poster:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2858430/ss_b64849a46d7e3fd5891ff4658fb9e93fd38eac52.600x338.jpg",
      sources: [
        {
          src: "https://video.cloudflare.steamstatic.com/store_trailers/257021477/movie480_vp9.webm?t=1716053340",
          type: "video/webm",
        },
        {
          src: "https://video.akamai.steamstatic.com/store_trailers/2858430/697149/652e1e7e6375970ec2e96042fd54b79f12ef1f20/1750948128/hls_264_master.m3u8?t=1716053340",
          type: "application/vnd.apple.mpegurl",
        },
      ],
    },
    links: [
      {
        icon: FaSteam,
        url: "https://store.steampowered.com/app/2858430/Lake_Minnewaska/",
        label: "View on Steam",
      },
    ],
  },
  {
    title: "Roamy Trip",
    description:
      "A full-stack application for hotel discovery and travel planning with social features. Provides an interactive map showing hotel locations worldwide, with review sharing and friend connections.",
    tags: ["React Native", "Expo", "Node.js", "Express", "Mobile Development"],
    imageUrl: roamyImg,
    links: [],
  },
];

export const skillGroupsData = [
  {
    title: "Languages",
    skills: [
      { name: "TypeScript", icon: createElement(SiTypescript) },
      { name: "JavaScript", icon: createElement(BiLogoJavascript) },
      { name: "Swift", icon: createElement(SiSwift) },
      { name: "Kotlin", icon: createElement(SiKotlin) },
      { name: "Java", icon: createElement(FaJava) },
      { name: "C++", icon: createElement(TbBrandCpp) },
      { name: "C#", icon: createElement(TbBrandCSharp) },
      { name: "C", icon: createElement(SiC) },
      { name: "Go", icon: createElement(TbBrandGolang) },
      { name: "Python", icon: createElement(FaPython) },
      { name: "Dart", icon: createElement(SiDart) },
      { name: "SQL", icon: createElement(TbSql) },
    ],
  },
  {
    title: "Web & Mobile",
    skills: [
      { name: "React", icon: createElement(FaReact) },
      { name: "Next.js", icon: createElement(TbBrandNextjs) },
      { name: "Node.js", icon: createElement(SiNodedotjs) },
      { name: "Express", icon: createElement(SiExpress) },
      { name: "SwiftUI", icon: createElement(FaApple) },
      { name: "Android", icon: createElement(SiAndroid) },
      { name: "Flutter", icon: createElement(SiFlutter) },
      { name: "React Native", icon: createElement(FaReact) },
      { name: "HTML", icon: createElement(FaHtml5) },
      { name: "CSS", icon: createElement(FaCss3Alt) },
    ],
  },
  {
    title: "Backend, Data & ML",
    skills: [
      { name: "Spring Boot", icon: createElement(BiLogoSpringBoot) },
      { name: "MySQL", icon: createElement(SiMysql) },
      { name: "SQLite", icon: createElement(SiSqlite) },
      { name: "Firebase", icon: createElement(BiLogoFirebase) },
      { name: "AWS", icon: createElement(FaAws) },
      { name: "Docker", icon: createElement(FaDocker) },
      { name: "PyTorch", icon: createElement(SiPytorch) },
      { name: "TensorFlow", icon: createElement(SiTensorflow) },
    ],
  },
  {
    title: "Games & Tools",
    skills: [
      { name: "Unity", icon: createElement(FaUnity) },
      { name: "Perforce", icon: createElement(SiPerforce) },
      { name: "GitHub", icon: createElement(FaGithub) },
    ],
  },
] as const;
