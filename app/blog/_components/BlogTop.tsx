import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Ellipsis, Eye, Heart, LinkIcon, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Xicon from "@/assets/xicon.svg";
import Facebookicon from "@/assets/facebookicon.svg";
import Whatsicon from "@/assets/whatsicon.svg";
import {
  TwitterShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "next-share";

interface BlogTopProps {
  tags: string[];
  imageUrl: string | undefined;
  authorName: string | undefined;
  likes: string[] | undefined;
  views: number;
  userId: Id<"users"> | undefined;
  authorId: Id<"users"> | undefined;
  blogId: Id<"blogs">;
  title: string;
}

const BlogTop = ({
  tags,
  imageUrl,
  authorName,
  likes,
  views,
  userId,
  authorId,
  blogId,
  title,
}: BlogTopProps) => {
  const router = useRouter();
  const deleteBlog = useMutation(api.blogs.deleteBlog);
  const toggleLike = useMutation(api.blogs.toggleLikeBlog);
  async function onDelete() {
    router.push("/");
    await deleteBlog({ id: blogId });
    console.log("Deleted successfully!");
  }

  const handleLike = async () => {
    await toggleLike({ blogId: blogId, userId: userId });
  };

  const onCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    console.log("Link copied");
  };
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <Image
            src={
              imageUrl
                ? imageUrl
                : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
            }
            alt="profile_img"
            width={500}
            height={500}
            className="h-12 w-12 object-cover object-center rounded-full"
          />

          <div>
            <Link
              href={`/profile/${authorId}`}
              className="font-semibold hover:underline md:text-lg"
            >
              {authorName}
            </Link>
            <p className="text-gray-500 text-sm md:text-base">Author</p>
          </div>
        </div>

        <div className="flex space-x-3 md:space-x-5 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Share className="h-4 w-4 md:h-5 md:w-5 stroke-[#6C40FE] cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-gray-700">
              <DropdownMenuItem
                onClick={() =>
                  onCopy(`${window.location.origin}/blog/${blogId}`)
                }
                className="cursor-pointer"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <TwitterShareButton
                  url={`${window.location.origin}/blog/${blogId}`}
                  title={`${title}`}
                >
                  <div className="flex">
                    <Image src={Xicon} alt="X" className="h-4 w-4 mr-2" />
                    <p>Share on X</p>
                  </div>
                </TwitterShareButton>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FacebookShareButton
                  url={`${window.location.origin}/blog/${blogId}`}
                  quote={`${title}`}
                >
                  <div className="flex">
                    <Image
                      src={Facebookicon}
                      alt="facebook"
                      className="h-4 w-4 mr-2"
                    />
                    <p>Share on facebook</p>
                  </div>
                </FacebookShareButton>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <WhatsappShareButton
                  url={`${window.location.origin}/blog/${blogId}`}
                  title={`${title}`}
                  separator=":: "
                >
                  <div className="flex">
                    <Image
                      src={Whatsicon}
                      alt="whatsapp"
                      className="h-4 w-4 mr-2"
                    />
                    <p>Share on whatsapp</p>
                  </div>
                </WhatsappShareButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex space-x-1 items-center">
            {userId ? (
              <Heart
                onClick={handleLike}
                className={`h-4 w-4 md:h-5 md:w-5 stroke-[#6C40FE] cursor-pointer ${likes?.includes(userId as Id<"users">) ? "fill-[#6C40FE]" : ""}`}
              />
            ) : (
              <Heart
                onClick={() => alert("Sign in to like!")}
                className="h-4 w-4 md:h-5 md:w-5 stroke-[#6C40FE] cursor-pointer"
              />
            )}
            <p className="text-[#6C40FE]">
              {likes == undefined ? "0" : likes.length}
            </p>
          </div>

          <div className="flex space-x-1 items-center">
            <Eye className="h-4 w-4 md:h-5 md:w-5 stroke-[#6C40FE]" />
            <p className="text-[#6C40FE]">{views}</p>
          </div>

          {userId == authorId && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis className="h-5 w-5 md:h-6 md:w-6 mt-2" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push(`/blog/${blogId}/edit`);
                    }}
                    className="cursor-pointer"
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-red-500 hover:!text-red-500  cursor-pointer"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      <div>
        {tags.map((tag) => (
          <div
            key={tag}
            className="mr-2 bg-gray-800 text-gray-200 text-xs md:text-sm inline-flex items-center px-5 py-1.5 rounded-full"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogTop;
