import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Img from "@/assets/featuredImg.jpg";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CommentList from "./CommentList";

interface CommentsProps {
  userId: Id<"users"> | undefined;
  blogId: Id<"blogs">;
}

const Comments = ({ userId, blogId }: CommentsProps) => {
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState<Id<"comments">>();
  const comments = useQuery(api.comments.getAllComments);
  const [comment, setComment] = useState("");
  const updateComment = useMutation(api.comments.updateComment);
  const storeComments = useMutation(api.comments.storeComments);
  const { user } = useUser();

  const handleComments = async () => {
    if (!userId) {
      return;
    }
    if (!comment) {
      alert("Please input a comment.");
      return;
    }
    await storeComments({
      userId,
      blogId,
      comment,
    })
      .then(() => {
        alert("Comment submitted successfully.");
        setComment("");
      })
      .catch((error) => {
        console.log(error);
        alert("Something went wrong.");
      });
  };

  const handleEditComment = async (id: Id<"comments">) => {
    if (!id || !userId) {
      return;
    }

    if (!comment) {
      alert("Please input a comment.");
      return;
    }

    await updateComment({
      id,
      comment,
      blogId,
      userId,
    })
      .then(() => {
        alert("Comment updated successfully.");
        setComment("");
        setEdit(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Something went wrong.");
      });
  };
  return (
    <div>
      <h1 className="font-semibold text-lg mb-3 md:hidden">
        Comments (
        {comments?.filter((comment) => blogId === comment.blogId).length || "0"}
        )
      </h1>

      <div className="flex flex-col md:flex-row justify-between w-full md:space-x-6">
        <div className="flex basis-1/2 bg-white flex-col w-full border shadow-lg p-4 max-w-lg rounded-lg">
          <textarea
            placeholder="What are your thoughts?"
            className="bg-transparent focus:outline-none resize-none"
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex w-full mt-2 justify-end">
            {user ? (
              !edit ? (
                <Button
                  onClick={handleComments}
                  className="rounded-full py-1.5 px-5 bg-[#6C40FE] hover:bg-[#6134f3]"
                >
                  Post comment
                </Button>
              ) : (
                <Button
                  onClick={() => handleEditComment(id as Id<"comments">)}
                  className="rounded-full py-1.5 px-5 bg-[#6C40FE] hover:bg-[#6134f3]"
                >
                  Edit Comment
                </Button>
              )
            ) : (
              <SignInButton>
                <Button className="rounded-full py-1.5 px-5 bg-[#6C40FE] hover:bg-[#6134f3]">
                  Post comment
                </Button>
              </SignInButton>
            )}
          </div>
        </div>

        <div className="basis-1/2 mt-8 md:mt-0">
          <h1 className="font-semibold text-lg mb-3 hidden md:inline-block">
            Comments (
            {comments?.filter((comment) => blogId === comment.blogId).length ||
              "0"}
            )
          </h1>
          {comments &&
            comments
              ?.filter((comment) => blogId === comment.blogId)
              .slice(0, 1)
              .map((comment) => (
                <div key={comment._id}>
                  <div className="flex items-center justify-between w-full space-x-2">
                    <div className="flex space-x-2">
                      <Image
                        src={comment.commentCreator?.imageUrl || ""}
                        width={500}
                        height={500}
                        alt="profile_img"
                        className="h-8 w-8 md:h-10 md:w-10 rounded-full"
                      />
                      <div>
                        <Link href={`/profile/${comment.commentCreator._id}`}>
                          <p className="font-semibold hover:underline text-sm md:text-base">
                            {comment.commentCreator?.name}
                          </p>
                        </Link>
                        <p className="text-gray-500 text-xs md:text-sm">
                          {new Date(comment._creationTime).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-gray-800 text-sm md:text-base">
                    {comment.comment}
                  </p>
                </div>
              ))}

          {comments?.filter((comment) => blogId === comment.blogId).length ? (
            <CommentList
              currentBlogId={blogId}
              setComment={setComment}
              setEdit={setEdit}
              setId={setId}
            />
          ) : (
            <p>No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
