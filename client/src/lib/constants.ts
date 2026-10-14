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
    "position": "Lead Software Engineer (Contract)",
    "company": "FlatFour Ventures",
    "location": "USA (Remote)",
    "period": "Jul 2026 – Present",
    "description": [
      "Own delivery of full-stack ecommerce web applications in React.js, TypeScript, Next.js and Node.js, from architecture decisions through release.",
      "Build backend services and REST APIs, including payment gateway and authentication integrations.",
      "Work directly with clients and stakeholders to define requirements, scope the work and keep releases on schedule."
    ],
    "skills": [
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
    "position": "Web Developer",
    "company": "ZealousWeb Technologies Pvt. Ltd.",
    "location": "Ahmedabad, India",
    "period": "Apr 2022 – Jun 2026",
    "description": [
      "Primary developer on 5+ production ecommerce sites for USA, UK and Portugal clients, building about 90% of each: storefront, cart, checkout and order processing.",
      "Built with React.js, TypeScript, Next.js and Node.js on the frontend, with backend work in Python/FastAPI or ASP.NET Core depending on the client.",
      "Integrated Stripe and Authorize.net payments and ID.me identity verification into checkout and account flows.",
      "Built address forms on the Google Maps Places API and reworked the autofill logic to cut down on wrong addresses at checkout.",
      "Split large form code into reusable components and moved shared state to Redux, so the same pieces could be reused across pages.",
      "Reduced bundle size and added lazy loading to speed up page loads.",
      "Worked in Agile sprints with designers and backend engineers to ship responsive, accessible sites."
    ],
    "skills": [
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
    "position": "Trainee",
    "company": "Aark Inosoft",
    "location": "Ahmedabad, India",
    "period": "Nov 2021 – Mar 2022",
    "description": [
      "Built responsive, cross-browser client websites with HTML5, CSS3, JavaScript and jQuery.",
      "Supported senior developers on ASP.NET Web Forms and ASP.NET MVC backends in C# and SQL Server, and helped with QA testing and bug fixing."
    ],
    "skills": [
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
    "degree": "B.E. Computer Engineering",
    "institution": "D.A. Degree Engineering & Technology",
    "period": "2020 – 2023",
    "cgpa": "8.3/10"
  },
  {
    "degree": "Diploma in Computer Engineering",
    "institution": "D.A. Diploma Engineering & Technology",
    "period": "2016 – 2019",
    "cgpa": "7.3/10"
  }
];

export const projects: Project[] = [
  {
    id: 1,
    title: "MightyMeals",
    category: "Web App",
    description: "High-traffic ecommerce platform for an $18M USD annual revenue meal delivery business, processing thousands of transactions a week. Headless React.js frontend on a WooCommerce backend via REST APIs, with custom ordering workflows and secure payment processing.",
    image: "https://eatmightymeals.com/wp-content/uploads/2019/08/DSC6681.jpg",
    technologies: ["React.js", "JavaScript", "REST APIs", "WooCommerce", "Python/FastAPI", "Stripe", "Authorize.net"],
    demoLink: "https://mightymeals.com/",
    demoLinkText: "Live Demo",
  },
  {
    id: 2,
    title: "By Best",
    category: "Web App",
    description: "Fashion and accessories ecommerce store. Primary developer on the frontend: React.js product catalogue, product pages, filtering and search, and the cart and checkout flow integrated with a Laravel backend through REST APIs.",
    image: "https://bybest.shop/assets/img/bybest-logo.png",
    technologies: ["React.js", "REST APIs", "Laravel"],
    demoLink: "https://bybest.shop/",
    demoLinkText: "Live Demo",
  },
  {
    id: 3,
    title: "Fields In Trust",
    category: "Web App",
    description: "UK charity protecting parks, playgrounds and green spaces. Built the ASP.NET MVC website in C# with Entity Framework: content management for the charity's staff, web forms and location-based search of protected fields across the UK.",
    image: FITImage,
    technologies: ["ASP.NET MVC", "C#", "Entity Framework", "Razor Pages"],
    demoLink: "https://fieldsintrust.org/",
    demoLinkText: "Live Demo",
  },
];
