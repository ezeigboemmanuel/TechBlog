import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Id } from "@/convex/_generated/dataModel";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import MarkdownDisplay from "./MarkdownDisplay";

interface ContentProps {
  blogId: Id<"blogs">;
  title: string;
  imageUrl: string;
  article: string;
}

const Content = ({ title, imageUrl, article, blogId }: ContentProps) => {
  return (
    <div className="py-5">
      <div className="flex md:items-center justify-between flex-col md:flex-row md:space-x-4">
        <h1 className="uppercase text-2xl md:text-4xl font-bold">{title}</h1>
        <div className="flex items-center text-gray-700 mt-2 md:mt-0 text-sm md:text-base">
          <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
          <p className="text-nowrap">0 comments</p>
        </div>
      </div>

      <div className="mt-3">
        <AspectRatio ratio={16 / 7.5}>
          <Image
            fill
            src={imageUrl}
            alt="blog_img"
            className="object-cover object-center w-full h-full"
          />
        </AspectRatio>
      </div>

      <div className="py-3">
        <MarkdownDisplay>{article}</MarkdownDisplay>
      </div>
    </div>
  );
};

export default Content;


{/* <div className="py-3">
<MarkdownDisplay>{article}</MarkdownDisplay>
</div> */}