export default function Storefront({ params }: { params: { slug: string } }) {
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">Store: {params.slug}</h1>
            <p>This screen will be implemented in the next design drop. Route is reserved.</p>
        </div>
    );
}
