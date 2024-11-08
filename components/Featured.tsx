import Image from "next/image";
import Link from "next/link";
import FeaturedImg from "@/assets/featuredImg.jpg";
import { MoveRight } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface FeaturedProps {
  blogs: {
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

const Featured = ({ blogs }: FeaturedProps) => {
  const blogId = "j971kgfvnkx36j7g6br61v0a4173xtje";
  const featured = blogs.filter((blog) => blog._id == blogId);

  if (featured.length === 0) {
    return;
  }

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200; // Average words per minute
    const textLength = content.split(/\s+/).length; // Split by spaces to count words
    const readingTime = Math.ceil(textLength / wordsPerMinute); // Calculate and round up to the next minute
    return readingTime;
  };

  return (
    <div>
      {featured.map((item) => {
        const readingTime = calculateReadingTime(item.article);
        return (
          <Link key={item._id} href={`/blog/${item._id}`}>
            <div className="mt-6 mb-6 md:mt-10 md:mb-10 bg-[#FCFCFE] rounded-xl group flex flex-col md:flex-row cursor-pointer">
              <div className="w-full max-w-2xl">
                <Image
                  src={item.imageUrl}
                  alt="featured Image"
                  className="rounded-t-xl md:rounded-l-xl md:rounded-tr-none object-cover object-center w-full max-h-[380px] md:max-h-[450px]"
                  width={1000}
                  height={1000}
                />
              </div>

              <div className="p-3 md:p-10 flex flex-col w-full md:min-h-[450px]">
                {/* For Text content */}
                <div className="uppercase text-gray-600 flex justify-between text-sm md:text-base mb-2 md:mb-4">
                  <p>
                    {new Date(item._creationTime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>{readingTime} MIN READ</p>
                </div>

                <h1 className="text-2xl md:text-4xl mb-3 md:mb-6 group-hover:underline">
                  {item.title}
                </h1>

                <div className="flex-grow">
                  <div
                    className="mr-2 mb-2 rounded-full border border-gray-600 hover:bg-transparent
             text-gray-600 hover:text-gray-600 cursor-default px-5 py-1.5 inline-flex text-sm md:text-base"
                  >
                    {item.categories[0]}
                  </div>
                </div>

                <div className="flex text-gray-600 mt-4 items-center text-sm md:text-base">
                  <p className="mr-2">Read Now</p>
                  <MoveRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Featured;
