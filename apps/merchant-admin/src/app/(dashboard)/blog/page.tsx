import { getBlogPosts } from "./actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function BlogListPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/signin");
    if (!session.user.storeId) redirect("/onboarding");

    const posts = await getBlogPosts(session.user.storeId);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Blog posts</h1>
                    <p className="text-muted-foreground">Manage your articles and SEO content.</p>
                </div>
                <Link href="/dashboard/blog/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Post
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-muted-foreground mb-4">No posts yet.</p>
                        <Link href="/dashboard/blog/new">
                            <Button variant="outline">Create your first post</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Title</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Published</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr]:border-b">
                                {posts.map((post) => (
                                    <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">
                                            {post.title}
                                            <div className="text-xs text-muted-foreground font-normal">/{post.slug}</div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                                                {post.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/dashboard/blog/${post.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
