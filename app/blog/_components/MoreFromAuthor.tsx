import BlogList from "@/components/BlogList";
import { Separator } from "@/components/ui/separator";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";

interface MoreFromAuthorProps {
  blogs:
    | {
        imageUrl: string;
        _id: Id<"blogs">;
        _creationTime: number;
        likes?: string[] | undefined;
        storageId: Id<"_storage">;
        format: string;
        userId: Id<"users">;
        title: string;
        article: string;
        views: number;
        categories: string[];
      }[];
}
const MoreFromAuthor = ({ blogs }: MoreFromAuthorProps) => {
  return (
    <div className="pt-6 pb-10 bg-[#FCFCFE] -m-4 px-4 md:px-8">
      <h1 className="font-semibold text-lg md:text-2xl">
        More from Author
      </h1>

      <BlogList blogs={blogs} />
    </div>
  );
};

export default MoreFromAuthor;
