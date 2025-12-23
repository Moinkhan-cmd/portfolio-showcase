import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import weatherAppImage from "@/images/weather-app.png"; // or .jpg - adjust extension as needed

const projects = [
	{
		title: "Project Name Here",
		description:
			"Brief description of what this project does. Explain the problem it solves and key features.",
		techStack: ["React", "TypeScript", "Tailwind CSS"],
		liveUrl: "#",
		githubUrl: "#",
		image: null,
	},
	{
		title: "E-Commerce Dashboard",
		description:
			"A comprehensive admin dashboard for managing products, orders, and analytics with real-time updates.",
		techStack: ["JavaScript", "React", "Chart.js"],
		liveUrl: "#",
		githubUrl: "#",
		image: null,
	},
	{
		title: "Weather Application",
		description:
			"A beautiful weather app that displays current conditions and forecasts using a weather API.",
		techStack: ["HTML", "CSS", "JavaScript", "API"],
		liveUrl: "https://inspiring-speculoos-f9e5d7.netlify.app/",
		githubUrl: "https://github.com/Moinkhan-cmd/Weather-App",
		image: weatherAppImage,
	},
];

export const ProjectsSection = () => {
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.1 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<section
			id="projects"
			ref={sectionRef}
			className="section-padding relative"
		>
			<div className="container mx-auto container-padding">
				{/* Section Header */}
				<div
					className={`text-center mb-16 ${
						isVisible ? "animate-slide-up" : "opacity-0"
					}`}
				>
					<span className="text-primary text-sm font-medium uppercase tracking-wider">
						Projects
					</span>
					<h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
						Featured{" "}
						<span className="gradient-text">Work</span>
					</h2>
					<p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
						A selection of projects that showcase my skills and passion for web
						development
					</p>
				</div>

				{/* Projects Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{projects.map((project, index) => (
						<div
							key={project.title}
							className={`group glass-card rounded-2xl overflow-hidden hover-lift ${
								isVisible ? "animate-slide-up" : "opacity-0"
							}`}
							style={{ animationDelay: `${0.1 + index * 0.1}s` }}
						>
							{/* Project Image Placeholder */}
							<div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
								{project.image ? (
									<img
										src={project.image}
										alt={project.title}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center">
										<Folder className="w-16 h-16 text-primary/40" />
									</div>
								)}

								{/* Hover overlay */}
								<div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
									<a
										href={project.liveUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="p-3 glass-card rounded-full hover:bg-primary/20 transition-colors"
										aria-label="Live Demo"
									>
										<ExternalLink className="w-5 h-5" />
									</a>
									<a
										href={project.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="p-3 glass-card rounded-full hover:bg-primary/20 transition-colors"
										aria-label="GitHub"
									>
										<Github className="w-5 h-5" />
									</a>
								</div>
							</div>

							{/* Project Content */}
							<div className="p-6">
								<h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
									{project.title}
								</h3>
								<p className="text-muted-foreground text-sm mb-4 line-clamp-2">
									{project.description}
								</p>

								{/* Tech Stack */}
								<div className="flex flex-wrap gap-2 mb-4">
									{project.techStack.map((tech) => (
										<span
											key={tech}
											className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground"
										>
											{tech}
										</span>
									))}
								</div>

								{/* Action Buttons */}
								<div className="flex gap-3">
									<Button
										variant="hero"
										size="sm"
										asChild
										className="flex-1"
									>
										<a
											href={project.liveUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											<ExternalLink className="w-4 h-4" />
											Live Demo
										</a>
									</Button>
									<Button variant="outline" size="sm" asChild>
										<a
											href={project.githubUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Github className="w-4 h-4" />
										</a>
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
