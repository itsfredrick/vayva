"use client";

import { Button, Card, EmptyState, Icon, StatusChip } from "@vayva/ui";
import { FolderPlus, Image as ImageIcon, MoreVertical, Search, Lock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export interface Project {
    id: string;
    title: string;
    description: string;
    images: any[];
    clientMode: boolean;
    createdAt: string;
    updatedAt: string;
}

export function ProjectCard({ project }: { project: Project }) {
    const imageCount = Array.isArray(project.images) ? project.images.length : 0;
    const coverImage = imageCount > 0 ? project.images[0].url : null;

    return (
        <Card className="overflow-hidden group hover:shadow-md transition-shadow">
            <Link href={`/dashboard/portfolio/${project.id}`}>
                <div className="aspect-[4/3] bg-gray-100 relative">
                    {coverImage ? (
                        <img src={coverImage} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon size={32} strokeWidth={1.5} />
                        </div>
                    )}
                    {project.clientMode && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                            <Lock size={10} /> Private
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate pr-2">
                                {project.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-1">
                                {project.description || "No description"}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-400 border-t pt-3">
                        <span className="flex items-center gap-1">
                            <ImageIcon size={12} /> {imageCount} images
                        </span>
                        <span>
                            Last updated {format(new Date(project.updatedAt), "MMM d, yyyy")}
                        </span>
                    </div>
                </div>
            </Link>
        </Card>
    );
}
