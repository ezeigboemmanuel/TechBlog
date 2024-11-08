"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import SetupForm from "../../_components/SetupForm";

const ProfileEditPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);
  const params = useParams(); // Get the profileId from the URL parameters

  if (!user) {
    router.push("/");
    return;
  }

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  // If the user is trying to edit someone else's profile, throw an error
  if (currentUser?._id !== params.profileId) {
    throw new Error("Unauthorised!");
  }

  return (
    <div className="py-6 md:py-10 max-w-xl mx-auto">
      <h1 className="text-2xl md:text-4xl">Update your profile</h1>
      <p className="text-gray-700 text-sm md:text-base">
        Update your personal information.
      </p>

      <div className="mt-4">
        <SetupForm currentUser={currentUser} />
      </div>
    </div>
  );
};

export default ProfileEditPage;
