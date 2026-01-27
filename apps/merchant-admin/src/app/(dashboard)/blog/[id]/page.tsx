import { BlogForm } from "../blog-form";
import { getBlogPost, updateBlogPost } from "../actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

type Props = {
    params: { id: string }
};

export default async function EditBlogPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/signin");
    if (!session.user.storeId) redirect("/onboarding");

    const post = await getBlogPost(session.user.storeId, params.id);
    if (!post) notFound();

    const updateAction = updateBlogPost.bind(null, session.user.storeId, params.id);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Edit post</h1>
            </div>
            <BlogForm
                initialData={post}
                action={updateAction}
                submitLabel="Update Post"
            />
        </div>
    );
}
