import { Project } from "./types";
import FITImage from '../../assets/images/fit.jpg'

export const frontendSkills = [
  { name: "React.js / Next.js", percentage: 92 },
  { name: "TypeScript / JavaScript", percentage: 94 },
  { name: "HTML5/CSS3", percentage: 90 },
  { name: "Redux", percentage: 85 },
  { name: "Responsive Design", percentage: 92 },
];

export const backendSkills = [
  { name: "Node.js", percentage: 88 },
  { name: "Express.js", percentage: 86 },
  { name: "REST API Design", percentage: 90 },
  { name: "PostgreSQL", percentage: 80 },
  { name: "MongoDB", percentage: 78 },
];

export const devopsSkills = [
  { name: "Git/GitHub", percentage: 92 },
  { name: "Docker", percentage: 78 },
  { name: "AWS", percentage: 75 },
  { name: "CI/CD", percentage: 80 },
  { name: "Testing (Jest, Mocha)", percentage: 85 },
];

export const additionalSkills = [
  "ReactJS",
  "NextJS",
  "TypeScript",
  "JavaScript",
  "NodeJS",
  "Python - FastAPI",
  "PostgreSQL",
  "MongoDB",
  "Bootstrap CSS",
  "HTML",
  "CSS",
  "ASP.NET Core",
  "ASP.NET MVC",
  "MSSQL",
];

export const experience = [
  {
    position: "Lead Software Engineer",
    company: "FlatFour Ventures",
    location: "USA",
    period: "Jul 2026 – Present",
    description: [
      "Own end-to-end delivery of full-stack web applications built with React.js, TypeScript, Next.js, and Node.js, from technical architecture through release.",
      "Design and build backend services and REST APIs, integrating third-party services, payment gateways, and authentication to deliver secure, scalable, and maintainable solutions.",
      "Lead and mentor engineers through code reviews and shared engineering standards, raising code quality and consistency across the codebase.",
      "Collaborate directly with clients and cross-functional stakeholders to define requirements, scope technical solutions, and keep delivery on schedule."
    ],
    skills: [
      "React.js",
      "TypeScript",
      "Next.js",
      "Node.js",
      "REST APIs",
      "Payment Integration",
      "Authentication"
    ]
  },
  {
    position: "Web Developer",
    company: "ZealousWeb Technologies Pvt. Ltd.",
    location: "Ahmedabad, India",
    period: "Apr 2022 – Jun 2026",
    description: [
      "Engineered and maintained production-grade full-stack web applications using React.js, TypeScript, Next.js, and Node.js, with backend work in Python/FastAPI and ASP.NET Core across client projects.",
      "Led third-party integrations including Stripe and Authorize.net payment processing and ID.me identity verification, delivering secure checkout and user-verification flows for production applications.",
      "Built dynamic address forms with the Google Maps Places API and refined autofill logic, improving data accuracy and checkout UX.",
      "Strengthened frontend architecture by modularizing form components into reusable building blocks and adopting Redux for predictable state management.",
      "Optimized bundle size and implemented lazy loading to improve page-load performance.",
      "Collaborated with designers and backend engineers in Agile sprints to ship responsive, accessible, scalable web applications."
    ],
    skills: [
      "React.js",
      "TypeScript",
      "Next.js",
      "Node.js",
      "Redux",
      "Stripe",
      "Authorize.net",
      "ID.me",
      "Google Maps API"
    ]
  },
  {
    position: "Trainee",
    company: "Aark Inosoft",
    location: "Ahmedabad, India",
    period: "Nov 2021 – Mar 2022",
    description: [
      "Built responsive, cross-browser client websites with HTML5, CSS3, JavaScript, and jQuery, adding interactive features to improve user engagement.",
      "Supported senior developers on ASP.NET Web Forms and ASP.NET MVC backends using C# and SQL Server, and contributed to QA testing and bug fixing."
    ],
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "jQuery",
      "ASP.NET Web Forms",
      "ASP.NET MVC",
      "C#",
      "SQL Server"
    ]
  }
];

export const education = [
  {
    degree: "Bachelor of Engineering in Computer Engineering",
    institution: "D.A. Degree Engineering & Technology",
    period: "2020 - 2023",
    cgpa: "8.3/10.0",
  },
  {
    degree: "Diploma in Computer Engineering",
    institution: "D.A. Diploma Engineering & Technology",
    period: "2016 - 2019",
    cgpa: "7.3/10.0",
  },
];

export const projects: Project[] = [
  {
    id: 1,
    title: "MightyMeals",
    category: "Web App",
    description: "MightyMeals is a meal delivery platform offering fresh, chef-prepared meals with a seamless user experience. I worked on the React.js frontend, implementing a responsive and intuitive UI. My contributions included integrating secure payment gateways, optimizing the checkout flow, and developing the order creation functionality.",
    image: "https://eatmightymeals.com/wp-content/uploads/2019/08/DSC6681.jpg",
    technologies: ["ReactJS", "WordPress", "Python - FastAPI"],
    demoLink: "https://mightymeals.com/",
    demoLinkText: "Live Demo",
  },
  {
    id: 2,
    title: "By Best",
    category: "Web App",
    description: "By Best is an eCommerce platform for fashion and accessories, offering clothing for men, women, and kids, along with jewelry, sunglasses, and more. I worked on the React.js frontend, building responsive product pages, optimizing filtering and search functionality, and integrating dynamic cart and checkout experiences.",
    image: "https://bybest.shop/assets/img/bybest-logo.png",
    technologies: ["ReactJS", "Laravel"],
    demoLink: "https://bybest.shop/",
    demoLinkText: "Live Demo",
  },
  {
    id: 3,
    title: "Fields In Trust",
    category: "Web App",
    description: "Fields In Trust is a UK-based charity dedicated to protecting parks, playgrounds, and green spaces for future generations. I contributed to the development of their ASP.NET MVC website, focusing on implementing dynamic content management, building secure and maintainable web forms, and integrating location-based features to help users find protected fields and sites across the UK.",
    image: FITImage,
    technologies: ["ASP.NET MVC", "C#", "Razor Pages", "Entity Framework"],
    demoLink: "https://fieldsintrust.org/",
    demoLinkText: "Live Demo",
  },
];
