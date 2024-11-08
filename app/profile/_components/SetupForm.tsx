"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const setupFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  bio: z.string().max(400).min(4),
  xLink: z.string().optional(),
  facebookLink: z.string().optional(),
  instaLink: z.string().optional(),
  whatsappLink: z.string().optional(),
});

interface SetupFormProps {
  currentUser:
    | {
        _id: Id<"users">;
        name: string | undefined;
        imageUrl: string | null | undefined;
        bio?: string | undefined;
        xLink?: string | undefined;
        facebookLink?: string | undefined;
        instaLink?: string | undefined;
        whatsappLink?: string | undefined;
        _creationTime: number;
        tokenIdentifier: string;
        format?: string | undefined;
        storageId?: Id<"_storage">;
      }
    | null
    | undefined;
}

const SetupForm = ({ currentUser }: SetupFormProps) => {
  const storeUser = useMutation(api.users.storeUser);
  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) {
    return;
  }

  const [imageUrl, setImageUrl] = useState<string | undefined | null>(
    currentUser?.imageUrl || user.imageUrl
  );
  const [selectedImage, setSelectedImage] = useState<File>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(e.target.files?.[0]);
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const form = useForm<z.infer<typeof setupFormSchema>>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      name: currentUser?.name || (user.fullName as string),
      bio: currentUser?.bio || "",
      xLink: currentUser?.xLink || "",
      facebookLink: currentUser?.facebookLink || "",
      instaLink: currentUser?.instaLink || "",
      whatsappLink: currentUser?.whatsappLink || "",
    },
  });

  async function onSubmit(data: z.infer<typeof setupFormSchema>) {
    if (!imageUrl) {
      alert("Please input an Image");
      return;
    }
    // When no image is selected
    if (!selectedImage && pathname == "/profile/setup") {
      await storeUser({
        name: data.name || (user?.fullName as string),
        bio: data.bio,
        format: "image",
        imageUrl: imageUrl,
        facebookLink: data.facebookLink,
        instaLink: data.instaLink,
        whatsappLink: data.whatsappLink,
        xLink: data.xLink,
      })
        .then(() => {
          console.log("User saved successfully.");
          router.push("/");
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (!selectedImage && pathname == `/profile/${currentUser?._id}/edit`) {
      {
        currentUser
          ? await updateUser({
              id: currentUser._id,
              name: data.name,
              bio: data.bio,
              format: "image",
              imageUrl: currentUser.imageUrl as string,
              storageId: currentUser.storageId,
              facebookLink: data.facebookLink,
              instaLink: data.instaLink,
              whatsappLink: data.whatsappLink,
              xLink: data.xLink,
            })
              .then(() => {
                console.log(`Profile updated.`);
                router.push(`/profile/${currentUser?._id}`);
                router.refresh();
              })
              .catch((error) => {
                console.log("Profile creation error.", error);
              })
          : console.log("An error occurred.");
      }
    }

    // When there is a new image selected
    if (selectedImage) {
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage,
      });

      const json = await result.json();

      if (!result.ok) {
        alert("Upload failed! Please try again.");
        throw new Error(`Upload failed: ${JSON.stringify(json)}`);
      }
      const { storageId } = json;

      // For Storing

      if (pathname == "/profile/setup") {
        await storeUser({
          name: data.name || (user?.fullName as string),
          bio: data.bio || "",
          format: "image",
          imageUrl: imageUrl,
          storageId: storageId || undefined,
          facebookLink: data.facebookLink || "",
          instaLink: data.instaLink || "",
          whatsappLink: data.whatsappLink || "",
          xLink: data.xLink || "",
        })
          .then(() => {
            console.log(`Profile created successfully.`);
            router.push(`/profile/${currentUser?._id}`);
          })
          .catch((error) => {
            console.log("Profile creation error.", error);
            router.push("/");
          });
      }

      // For Edit

      if (pathname == `/profile/${currentUser?._id}/edit`) {
        {
          currentUser
            ? await updateUser({
                id: currentUser._id,
                name: data.name,
                bio: data.bio,
                format: "image",
                imageUrl: imageUrl || (currentUser.imageUrl as string),
                storageId: storageId || currentUser.storageId,
                facebookLink: data.facebookLink,
                instaLink: data.instaLink,
                whatsappLink: data.whatsappLink,
                xLink: data.xLink,
              })
                .then(() => {
                  console.log(`Profile updated.`);
                  router.push(`/profile/${currentUser?._id}`);
                  router.refresh();
                })
                .catch((error) => {
                  console.log("Update profile error", error);
                })
            : console.log("An error occurred.");
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row justify-center md:justify-normal space-y-4 md:space-y-0 md:space-x-4 items-center">
          <Image
            src={imageUrl || user.imageUrl}
            alt="img"
            width={100}
            height={100}
            className="object-cover rounded-2xl h-28 w-28"
          />

          <div className="w-full">
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  className="shadow-md"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this anytime.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none shadow-md"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="xLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>X</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://x.com/johndoe419"
                  className="shadow-md"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Input your Twitter/X url (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebookLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://facebook.com/johndoe932"
                  className="shadow-md"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Input your Facebook url (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instaLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://instagram.com/johndoe233"
                  className="shadow-md"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Input your Instagram url (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whatsappLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Whatsapp</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://wa.me/922828229"
                  className="shadow-md"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Input your Whatsapp url (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {pathname == "/profile/setup" ? "Continue" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
};

export default SetupForm;
