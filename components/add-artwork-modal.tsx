"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, ImageIcon } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { toastError, toastSuccess } from "@/lib/helpers/toast";

export function AddArtworkModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const uploadPostImage = trpc.image.uploadPostImage.useMutation();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const uploadImages = async () => {
    if (files.length === 0) return;

    if (files.length > 4) {
      toastError("You can only upload a maximum of 4 images.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        uploadPostImage.mutate(base64String, {
          onSuccess: (url) => {
            setImageUrls((prev) => [...prev, url]);
          },
          onError: (err) => {
            toastError("Image upload failed. Please try again.");
            console.error("Upload failed", err);
          },
        });
      };
      reader.readAsDataURL(file);
    });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newPreviews: string[] = [];

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setPreviews((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Artwork</DialogTitle>
          <DialogDescription>
            Upload your artwork and provide details to showcase your creation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter artwork title" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your artwork, inspiration, techniques used, etc."
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" placeholder="abstract, digital, landscape" />
          </div>
          <div className="grid gap-2">
            <Label>Artwork Images</Label>
            {previews.length > 0 ? (
              <div className="grid grid-cols-4 gap-4 max-h-[400px] max-w-[400px] overflow-y-auto pr-2">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative w-full overflow-hidden rounded-md border"
                    style={{ aspectRatio: "4 / 3" }}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="h-full w-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed">
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports JPG, PNG (Maximum 4 Images)
                    </p>
                  </div>
                  <Input
                    id="artwork"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("artwork")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select Files
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => {
              uploadImages();
              //setOpen(false);
            }}
          >
            Upload Artwork
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
