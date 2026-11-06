// Edit this file to update the whole site.
export const profile = {
  name: "Joel Ebenka",
  roles: ["DevOps Engineer", "Cloud Engineer", "Terraform and CI/CD builder"],
  intro: "I design, automate and run CI/CD pipelines and cloud infrastructure on AWS, Azure and GCP for distributed international teams.",
  about: "Bilingual (English and French) DevOps Engineer with over five years of experience in regulated, high-availability environments across finance, transportation and healthcare. Available for full remote work or relocation.",
  email: "joelebenka45@yahoo.com",
  linkedin: "https://www.linkedin.com/in/joel-ebenka-b810651b5",
  github: "https://github.com/chrisjoel",
};
export const experience = [
  { title: "Cloud Support and DevOps Engineer", company: "MBOA Digital", period: "Mar 2025 to Mar 2026", place: "Remote client in New Zealand (Propellerhead)", points: [
    "Cut P1/P2 incident response time by 60% with monitoring in New Relic, PaperTrail and OpsGenie.",
    "Reduced escalations by 40% by fixing identity sync failures across Azure AD B2C, Dynamics 365 and SQL.",
    "Improved uptime by 30% through proactive infrastructure management and automated alerting."] },
  { title: "DevOps Engineer", company: "DR Financial Services", period: "May 2022 to Mar 2024", place: "Houston, USA, fully remote", points: [
    "Built end-to-end CI/CD pipelines on Jenkins (AWS EC2) with Maven, SonarQube and Git.",
    "Deployed a serverless platform with API Gateway, Lambda, DynamoDB and S3 hosting.",
    "Automated multi-server patching with Ansible; monitored with Grafana and Prometheus."] },
  { title: "DevOps and Cloud Support Engineer", company: "Data Service Group", period: "Apr 2020 to Feb 2022", place: "Delaware, USA, fully remote", points: [
    "Provisioned AWS environments (VPC, EC2, ELB, RDS, S3, IAM) with Terraform, cutting infrastructure incidents by 30%.",
    "Automated LAMP provisioning with Ansible and pushed Docker images to AWS ECR from Jenkins.",
    "Secured global static hosting with S3, CloudFront and Route 53."] },
];
const g = "https://github.com/chrisjoel/";
export const projects = [
  { name: "Highly available web app on AWS", text: "Terraform for a load-balanced, auto-scaling EC2 web fleet with security groups.", logos: ["terraform", "amazonwebservices"], cats: ["Terraform", "AWS"], href: g + "HA_Webapp_terraform" },
  { name: "Jenkins server on AWS", text: "Terraform provisions an EC2 instance and a script installs Jenkins automatically.", logos: ["terraform", "jenkins", "bash", "amazonwebservices"], cats: ["Terraform", "AWS", "CI/CD"], href: g + "jenkins_terraform_ec2_install" },
  { name: "EKS infrastructure with Terraform", text: "Infrastructure as code for an Amazon EKS Kubernetes environment.", logos: ["terraform", "kubernetes", "amazonwebservices"], cats: ["Terraform", "AWS", "Kubernetes"], href: g + "full-devops-terraform-eks-infra" },
  { name: "30-Day Terraform Challenge", text: "Hands-on exercises from the HashiCorp User Group Yaoundé challenge.", logos: ["terraform"], cats: ["Terraform"], href: g + "30-Day-Terraform-challenge-" },
  { name: "KiloShare", text: "Marketplace linking travellers with spare luggage allowance to people sending parcels between Cameroon and Russia.", logos: [], cats: [], href: "" },
  { name: "Pediatric health records platform", text: "Offline-first microservices record system for pediatric care in Yaoundé.", logos: [], cats: [], href: "" },
];
export const tools = [
  { name: "AWS", logo: "amazonwebservices", cat: "Cloud" }, { name: "Azure", logo: "azure", cat: "Cloud" }, { name: "Google Cloud", logo: "googlecloud", cat: "Cloud" },
  { name: "Terraform", logo: "terraform", cat: "IaC" }, { name: "Kubernetes", logo: "kubernetes", cat: "Containers" }, { name: "Docker", logo: "docker", cat: "Containers" },
  { name: "Jenkins", logo: "jenkins", cat: "CI/CD" }, { name: "Ansible", logo: "ansible", cat: "IaC" }, { name: "GitHub Actions", logo: "githubactions", cat: "CI/CD" },
  { name: "Git", logo: "git", cat: "CI/CD" }, { name: "GitHub", logo: "github", cat: "CI/CD" }, { name: "Maven", logo: "maven", cat: "CI/CD" },
  { name: "SonarQube", logo: "sonarqube", cat: "CI/CD" }, { name: "Grafana", logo: "grafana", cat: "Monitoring" }, { name: "Prometheus", logo: "prometheus", cat: "Monitoring" },
  { name: "Nginx", logo: "nginx", cat: "Containers" }, { name: "Linux", logo: "linux", cat: "Code" }, { name: "Python", logo: "python", cat: "Code" },
  { name: "Java", logo: "java", cat: "Code" }, { name: "Bash", logo: "bash", cat: "Code" },
];
export const skills = [
  { group: "CI/CD", items: "Jenkins, Maven, Git, SonarQube, SonarCloud, Artifactory" },
  { group: "Containers", items: "Docker, Docker Compose, Kubernetes, AWS ECR, GKE, Cloud Run" },
  { group: "Infrastructure as code", items: "Terraform, Ansible" },
  { group: "Cloud", items: "AWS, Azure, Google Cloud" },
  { group: "Monitoring", items: "Grafana, Prometheus, New Relic, PaperTrail, OpsGenie" },
  { group: "Languages", items: "Python, Java, Bash, SQL. English and French, both fluent" },
];
export const credentials = [
  "Google Cloud Associate Cloud Engineer, 2024",
  "AWS re/Start Graduate, 2022",
  "Jenkins Pipeline: Declarative Approaches and IaC, Udemy, 2022",
  "Introduction to Cybersecurity, Cisco Networking Academy, 2021",
  "Master's in Network and Information Security, EST LaSalle",
];
export const toolCats = ["All", "Cloud", "IaC", "CI/CD", "Containers", "Monitoring", "Code"];
export const alsoUse = "Artifactory, SonarCloud, Docker Compose, New Relic, PaperTrail, OpsGenie, SQL";

export type Cert = {
  id: string; name: string; issuer: string; logo: string; issued?: string; description?: string;
  credentialId?: string; url?: string; badge?: string; skills: string[];
};
// Fill in credentialId, url, badge (e.g. "/badges/gcp-ace.png") and a precise issue date to enrich each popup.
export const certifications: Cert[] = [
  { id: "gcp-ace", name: "Google Cloud Associate Cloud Engineer", issuer: "Google Cloud", logo: "googlecloud", badge: "/badges/gcp-ace.png", issued: "2024", credentialId: "3c897d4b-f664-46f2-8929-fbfb1893d1e1", url: "https://www.credly.com/badges/3c897d4b-f664-46f2-8929-fbfb1893d1e1/public_url", description: "Deploys applications, monitors operations and manages enterprise solutions on Google Cloud.", skills: ["GKE", "App Engine", "Cloud Run"] },
  { id: "lfc102", name: "Inclusive Open Source Community Orientation (LFC102)", issuer: "The Linux Foundation", logo: "linux", badge: "/badges/lfc102.png", credentialId: "c51e0de1-2d6c-42a4-a03f-a153615233d7", url: "https://www.credly.com/badges/c51e0de1-2d6c-42a4-a03f-a153615233d7/public_url", description: "Open source best practice: unconscious bias and building inclusive open source communities.", skills: ["Open source", "Inclusion"] },
  { id: "jenkins-pipeline", name: "Jenkins Pipeline: Declarative and IaC Approaches for DevOps", issuer: "Coursera", logo: "coursera", issued: "May 2024", credentialId: "AL7TJSQ7RNS2", url: "https://coursera.org/verify/AL7TJSQ7RNS2", skills: ["Jenkins", "CI/CD", "IaC"] },
  { id: "jenkins-delivery", name: "Jenkins: Automating Your Delivery Pipeline", issuer: "Coursera", logo: "coursera", issued: "Feb 2025", credentialId: "PM6YLEQ147RN", url: "https://coursera.org/verify/PM6YLEQ147RN", skills: ["Jenkins", "CI/CD"] },
  { id: "python-devops", name: "Python Scripting for DevOps", issuer: "Coursera", logo: "coursera", issued: "Feb 2025", credentialId: "6C9CGPA3KX2W", url: "https://coursera.org/verify/6C9CGPA3KX2W", skills: ["Python", "Automation"] },
  { id: "aws-restart", name: "AWS re/Start Graduate", issuer: "Amazon Web Services", logo: "amazonwebservices", issued: "2022", description: "Cloud Practitioner program completed through Orange Digital Center, Cameroon.", skills: [] },
  { id: "jenkins", name: "Jenkins Pipeline: Declarative Approaches and IaC", issuer: "Udemy", logo: "udemy", issued: "2022", skills: ["Jenkins", "CI/CD", "IaC"] },
  { id: "cisco-cyber", name: "Introduction to Cybersecurity", issuer: "Cisco Networking Academy", logo: "cisco", issued: "2021", skills: [] },
];
