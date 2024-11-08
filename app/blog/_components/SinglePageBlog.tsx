"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import BlogTop from "./BlogTop";
import Content from "./Content";
import Comments from "./Comments";
import { useEffect, useState } from "react";
import AuthorInfo from "./AuthorInfo";
import MoreFromAuthor from "./MoreFromAuthor";
import Recommended from "./Recommended";

const SinglePageBlog = () => {
  const params = useParams();
  const blog = useQuery(api.blogs.getSingleBlog, {
    id: params.blogId as Id<"blogs">,
  });

  const blogsByAuthor = useQuery(api.blogs.getAllBlogsByAuthor, {
    id: blog?.userId,
  });

  const recommendedBlogs = useQuery(api.blogs.getRecommendedBlogs, {
    category: blog?.categories[0],
  });
  const currentUser = useQuery(api.users.getCurrentUser);
  const incrementViewCount = useMutation(api.blogs.incrementViewCount);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    const increaseView = async () => {
      // Retrieve an array of previously viewed blog IDs from localStorage
      const viewedBlogs = JSON.parse(
        localStorage.getItem("viewedBlogs") || "[]"
      );

      // If the blog hasn't been viewed and hasViewed is false, increment the view count
      if (!viewedBlogs.includes(params.blogId) && !hasViewed) {
        await incrementViewCount({ blogId: params.blogId as Id<"blogs"> });

        // Add the current blog ID to viewedBlogs and update localStorage
        viewedBlogs.push(params.blogId);
        localStorage.setItem("viewedBlogs", JSON.stringify(viewedBlogs));

        // Set the hasViewed state to true to prevent future increments
        setHasViewed(true);
      }
    };

    increaseView();
  }, [params, hasViewed]); // Trigger this effect only when params or hasViewed changes

  if (!blog) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <BlogTop
        authorName={blog.author?.name}
        imageUrl={blog.author?.imageUrl}
        likes={blog.likes}
        tags={blog.categories}
        views={blog.views}
        userId={currentUser?._id}
        authorId={blog.author._id}
        blogId={blog._id}
        title={blog.title}
      />

      <Content
        blogId={blog._id}
        title={blog.title}
        article={blog.article}
        imageUrl={blog.imageUrl}
      />

      <Comments userId={currentUser?._id} blogId={blog._id} />

      <AuthorInfo
        name={blog.author?.name}
        imageUrl={blog.author?.imageUrl}
        authorId={blog.author._id}
        bio={blog.author.bio}
        xLink={blog.author.xLink}
        facebookLink={blog.author.facebookLink}
        instaLink={blog.author.instaLink}
        whatsappLink={blog.author.whatsappLink}
      />

      {blogsByAuthor && <MoreFromAuthor blogs={blogsByAuthor.slice(0, 3)} />}
      {recommendedBlogs && <Recommended blogs={recommendedBlogs.slice(0, 3)} />}
    </div>
  );
};

export default SinglePageBlog;
