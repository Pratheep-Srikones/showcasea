import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ArtworkType } from "@/types/types";
import { useArtStore } from "@/store/useArtStore";
import { trpc } from "@/lib/trpc/client";
import { toastError, toastSuccess } from "@/lib/helpers/toast";

export function EditArtworkModal({
  open,
  onClose,
  updateArray,
}: {
  updateArray: (artwork: ArtworkType) => void;
  open: boolean;
  onClose: () => void;
}) {
  const editArtworkMutation = trpc.artWork.editArtwork.useMutation();
  const { seletedArtWork: artwork, setSelectedArtWork } = useArtStore();
  const [title, setTitle] = useState(artwork?.title || "");
  const [description, setDescription] = useState(artwork?.description || "");
  const [tags, setTags] = useState(artwork?.tags?.join(", ") || "");
  const [isPublic, setIsPublic] = useState(artwork?.isPublic ?? false);
  const id = artwork?._id;

  const handleSubmit = () => {
    if (!id) {
      console.error("Artwork ID is missing.");
      return;
    }
    setSelectedArtWork({
      ...artwork,
      _id: id,
      title: title ? title : "",
      description,
      tags: tags.split(",").map((tag) => tag.trim()),
      isPublic,
    });
    editArtworkMutation.mutate(
      {
        _id: id,
        title: title ? title : "",
        description,
        tags: tags.split(",").map((tag) => tag.trim()),
        isPublic,
      },
      {
        onSuccess: (data) => {
          toastSuccess("Artwork Updated Successfully");
          updateArray(data.artwork);
          onClose();
        },
        onError: () => {
          toastError("Artwork Update Failed");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Artwork</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (artwork && artwork._id) {
                  setSelectedArtWork({
                    ...artwork,
                    _id: artwork._id,
                    title: e.target.value,
                  });
                }
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (artwork && artwork._id) {
                  setSelectedArtWork({
                    ...artwork,
                    _id: artwork._id,
                    description: e.target.value,
                  });
                }
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="visibility">Public</Label>
            <Switch
              id="visibility"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
