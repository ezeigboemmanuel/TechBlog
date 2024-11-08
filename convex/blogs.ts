import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const storeBlog = mutation({
  args: {
    title: v.string(),
    article: v.string(),
    imageUrl: v.string(),
    categories: v.array(v.string()),
    views: v.number(),
    likes: v.optional(v.array(v.id("users"))),
    storageId: v.id("_storage"),
    format: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user === null) {
      return;
    }

    await ctx.db.insert("blogs", {
      userId: user._id,
      title: args.title,
      article: args.article,
      categories: args.categories,
      views: args.views,
      likes: args.likes,
      imageUrl: args.imageUrl,
      storageId: args.storageId,
      format: args.format,
    });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getAllBlogs = query({
  args: { search: v.optional(v.string()), category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const title = args.search as string;
    const category = args.category as string;

    let blogs = [];

    if (title) {
      blogs = await ctx.db
        .query("blogs")
        .withSearchIndex("by_title", (q) => q.search("title", title))
        .collect();
    } else {
      blogs = await ctx.db.query("blogs").order("desc").collect();
    }

    const blogsWithImages = await Promise.all(
      blogs.map(async (blog) => {
        const imageUrl = await ctx.storage.getUrl(blog.storageId);
        if (!imageUrl) {
          throw new Error("Image not found");
        }
        return { ...blog, imageUrl: imageUrl };
      })
    );

    let filteredBlogs = blogsWithImages.filter((blog) =>
      blog.categories.includes(category)
    );
    if (filteredBlogs.length !== 0) {
      return filteredBlogs;
    } else {
      return blogsWithImages;
    }
  },
});

export const getSingleBlog = query({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);
    if (blog === null) {
      throw new Error("Article not found");
    }

    const newImageUrl = blog.storageId
      ? await ctx.storage.getUrl(blog.storageId as Id<"_storage">)
      : undefined;

    const author = await ctx.db.get(blog.userId);

    const authorImageUrl = author?.storageId
      ? await ctx.storage.getUrl(author.storageId as Id<"_storage">)
      : undefined;

    return {
      ...blog,
      imageUrl: newImageUrl ? newImageUrl : blog.imageUrl,
      author: {
        ...author,
        imageUrl: authorImageUrl ? authorImageUrl : author?.imageUrl,
      },
    };
  },
});

export const updateBlog = mutation({
  args: {
    id: v.id("blogs"),
    title: v.string(),
    article: v.string(),
    imageUrl: v.string(),
    categories: v.array(v.string()),
    views: v.number(),
    likes: v.optional(v.array(v.id("users"))),
    storageId: v.id("_storage"),
    format: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user === null) {
      return;
    }

    const updatedBlog = ctx.db.patch(args.id, {
      title: args.title,
      article: args.article,
      categories: args.categories,
      views: args.views,
      likes: args.likes,
      imageUrl: args.imageUrl,
      storageId: args.storageId,
      format: args.format,
    });

    return updatedBlog;
  },
});

export const deleteBlog = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user === null) {
      return;
    }

    await ctx.db.delete(args.id);
  },
});

export const toggleLikeBlog = mutation({
  args: {
    blogId: v.id("blogs"),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (!args.userId) {
      throw new Error("Unauthenticated.");
    }

    if (!blog) {
      throw new Error("Article not found");
    }

    const likes = blog.likes || [];
    // Check if the user already liked the blog
    const userIndex = likes.indexOf(args.userId);
    if (userIndex !== -1) {
      // User already liked the blog, so we remove the like
      likes.splice(userIndex, 1);
    } else {
      // User has not liked the blog yet, so we add the like
      likes.push(args.userId);
    }

    await ctx.db.patch(args.blogId, {
      likes: likes,
    });
  },
});

export const incrementViewCount = mutation({
  args: { blogId: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);

    if (!blog) {
      throw new Error("Article not found");
    }

    // Increment the views count
    await ctx.db.patch(args.blogId, {
      views: (blog.views || 0) + 1,
    });
  },
});

export const getAllBlogsByAuthor = query({
  args: { id: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const blogs = await ctx.db
      .query("blogs")
      .filter((q) => q.eq(q.field("userId"), args.id))
      .order("desc")
      .collect();

    const blogsWithImages = await Promise.all(
      blogs.map(async (blog) => {
        const imageUrl = await ctx.storage.getUrl(blog.storageId);
        if (!imageUrl) {
          throw new Error("Image not found");
        }
        return { ...blog, imageUrl: imageUrl };
      })
    );

    return blogsWithImages;
  },
});

export const getRecommendedBlogs = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const category = args.category as string;

    const blogs = await ctx.db.query("blogs").order("desc").collect();

    const blogsWithImages = await Promise.all(
      blogs.map(async (blog) => {
        const imageUrl = await ctx.storage.getUrl(blog.storageId);
        if (!imageUrl) {
          throw new Error("Image not found");
        }
        return { ...blog, imageUrl: imageUrl };
      })
    );

    let filteredBlogs = blogsWithImages.filter((blog) =>
      blog.categories.includes(category)
    );
    if (filteredBlogs.length !== 0) {
      return filteredBlogs;
    } else {
      return blogsWithImages;
    }
  },
});
