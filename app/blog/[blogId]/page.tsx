import { fetchQuery } from "convex/nextjs";
import SinglePageBlog from "../_components/SinglePageBlog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export async function generateMetadata({ params }: { params: { blogId: Id<"blogs"> } }) {
  const blog = await fetchQuery(api.blogs.getSingleBlog, {
    id: params.blogId,
  });

  return {
    metadataBase: new URL("https://your-deployed-url.com"),
    title: blog.title,
    description: blog.article.slice(0, 200),
    openGraph: {
      title: blog.title,
      description: blog.article.slice(0, 200),
      url: `https://your-deployed-url/blog/${blog._id}`,
      siteName: "TechBlog",
      images: [
        {
          url: blog.imageUrl,
        },
      ],
    },
  };
}

const BlogPage = () => {
  return (
    <div className="pt-6">
      <SinglePageBlog />
    </div>
  );
};

export default BlogPage;
