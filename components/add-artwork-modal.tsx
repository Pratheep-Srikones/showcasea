"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, ImageIcon } from "lucide-react"

export function AddArtworkModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearPreview = () => {
    setPreview(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Artwork</DialogTitle>
          <DialogDescription>Upload your artwork and provide details to showcase your creation.</DialogDescription>
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
            <Label>Artwork Image</Label>
            {preview ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                <img src={preview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full"
                  onClick={clearPreview}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed">
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Drag & drop or click to upload</p>
                    <p className="text-xs text-muted-foreground">Supports JPG, PNG, GIF up to 10MB</p>
                  </div>
                  <Input id="artwork" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById("artwork")?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Select File
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
          <Button type="submit" onClick={() => setOpen(false)}>
            Upload Artwork
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
