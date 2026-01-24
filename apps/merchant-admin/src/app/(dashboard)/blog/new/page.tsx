import { BlogForm } from "../blog-form";
import { createBlogPost } from "../actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewBlogPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) redirect("/signin");

    const createAction = createBlogPost.bind(null, session.user.storeId);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Create new post</h1>
            </div>
            <BlogForm action={createAction} submitLabel="Create Post" />
        </div>
    );
}
