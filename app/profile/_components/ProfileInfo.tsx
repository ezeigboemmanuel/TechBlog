"use client";
import Image from "next/image";
import FeaturedImg from "@/assets/featuredImg.jpg";
import Link from "next/link";
import { Pencil } from "lucide-react";
import Xicon from "@/assets/xicon.svg";
import Facebookicon from "@/assets/facebookicon.svg";
import Instaicon from "@/assets/instaicon.svg";
import Whatsicon from "@/assets/whatsicon.svg";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ProfileInfoProps {
  _id: Id<"users">;
  name: string | undefined;
  imageUrl: string | null | undefined;
  bio?: string | undefined;
  xLink?: string | undefined;
  facebookLink?: string | undefined;
  instaLink?: string | undefined;
  whatsappLink?: string | undefined;
}

const ProfileInfo = ({
  imageUrl,
  name,
  bio,
  _id,
  xLink,
  facebookLink,
  instaLink,
  whatsappLink,
}: ProfileInfoProps) => {
  const currentUser = useQuery(api.users.getCurrentUser);
  return (
    <div className="pt-10 px-4 md:px-8">
      {currentUser?._id === _id && (
        <h1 className="text-2xl md:text-4xl font-bold mb-5">Your Profile</h1>
      )}

      <div className="bg-[#FCFCFE] p-4 md:p-8 shadow-sm rounded-sm max-w-4xl">
        <div className="flex items-center space-x-2">
          <Image
            src={imageUrl as string} // We use the `imageUrl` prop here
            alt="profile_img"
            width={100}
            height={100}
            className="h-12 w-12 rounded-full"
          />
          <div>
            <p className="font-semibold md:text-lg">{name}</p>{" "}
            {/*Using name prop*/}
            <p className="text-gray-500 text-sm md:text-base">Author</p>
          </div>

          {currentUser?._id === _id && (
            <Link href={`/profile/${currentUser?._id}/edit`}>
              <Pencil className="w-5 h-5 stroke-[#6C40FE] cursor-pointer" />
            </Link>
          )}
        </div>

        <p className="text-gray-700 text-sm md:text-base mt-3">{bio}</p>

        <div className="flex space-x-2 md:space-x-4 mt-4">
          {xLink && (
            <Link href={xLink as string} target="_blank">
              <Image src={Xicon} alt="X" />
            </Link>
          )}
          {facebookLink && (
            <Link href={facebookLink as string} target="_blank">
              <Image src={Facebookicon} alt="Facebook" />
            </Link>
          )}
          {instaLink && (
            <Link href={instaLink as string} target="_blank">
              <Image src={Instaicon} alt="Instagram" />
            </Link>
          )}
          {whatsappLink && (
            <Link href={whatsappLink as string} target="_blank">
              <Image src={Whatsicon} alt="whatsapp" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
