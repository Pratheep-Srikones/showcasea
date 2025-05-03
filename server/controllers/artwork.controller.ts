import { deleteImage } from "@/lib/cloud/cloudinary";
import { ArtWork } from "@/lib/db/models/artwork.model";
import { ArtworkType } from "@/types/types";
import { TRPCError } from "@trpc/server";

export const createArtwork = async ({
  title,
  description,
  image_urls,
  tags,
  artistId,
}: {
  title: string;
  description: string;
  image_urls: string[];
  tags: string[];
  artistId: string;
}) => {
  const newArtWork = await ArtWork.create({
    title,
    description,
    image_urls,
    tags,
    artist: artistId,
  });

  return {
    message: "Artwork created successfully",
    artworkId: newArtWork._id,
  };
};

export const getArtWorksByArtistId = async (artistId: string) => {
  try {
    const artworks = await ArtWork.find({ artist: artistId })
      .populate("artist", {
        first_name: 1,
        last_name: 1,
        profile_picture_url: 1,
      })
      .sort({ createdAt: -1 });

    if (!artworks || artworks.length === 0) {
      console.error("No artworks found for the given artist ID:", artistId);
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No artworks found for the given artist ID",
      });
    }
    //console.log("artworks:", artworks);
    return artworks;
  } catch (error) {
    console.error("Error fetching artworks for artist ID:", artistId, error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while fetching artworks",
    });
  }
};

export const increaseViewCount = async (artworkId: string) => {
  try {
    const artwork = await ArtWork.findByIdAndUpdate(
      artworkId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!artwork) {
      console.error("Artwork not found");
      return null;
    }

    return {
      message: "View count increased successfully",
    };
  } catch (error) {
    console.error("Error updating artwork view count:", error);
    throw error;
  }
};

export const editArtwork = async (
  updatedData: Partial<ArtworkType>,
  userId: string
) => {
  const { _id, ...updateFields } = updatedData;
  // console.log("userId:", userId, "_id:", _id, "updateFields:", updateFields);
  const artwork = await ArtWork.findById(_id);
  if (!artwork) {
    console.error("Artwork not found");
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Artwork not found",
    });
  }
  if (artwork.artist._id.toString() !== userId.toString()) {
    //console.log("artistId:", artwork.artist._id.toString(), "userId:", userId);
    console.error("User is not the owner of this artwork");
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User is not the owner of this artwork",
    });
  }
  if (!updateFields || Object.keys(updateFields).length === 0) {
    console.error("No fields to update");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No fields to update",
    });
  }
  const updatedArtwork = await ArtWork.findByIdAndUpdate(
    _id,
    { $set: updateFields },
    { new: true }
  );
  if (!updatedArtwork) {
    console.error("Artwork not found after update");
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Artwork not found after update",
    });
  }
  return {
    message: "Artwork updated successfully",
    artwork: updatedArtwork,
  };
};

export const deleteArtwork = async (
  artworkId: string,
  image_urls: string[],
  userId: string
) => {
  console.log("Deleting artwork with ID:", artworkId, "by user ID:", userId);
  try {
    const artwork = await ArtWork.findById(artworkId);
    if (!artwork) {
      console.error("Artwork not found");
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Artwork not found",
      });
    }
    if (artwork.artist._id.toString() !== userId.toString()) {
      console.error("User is not the owner of this artwork");
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User is not the owner of this artwork",
      });
    }
    const deletedArtwork = await ArtWork.findByIdAndDelete(artworkId);
    if (!deletedArtwork) {
      console.error("Artwork not found");
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Artwork not found",
      });
    }

    for (const imageUrl of image_urls) {
      try {
        deleteImage(imageUrl);
        console.log("Image deleted successfully:", imageUrl);
      } catch (error) {
        console.error("Error deleting image:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete image",
        });
      }
    }

    return {
      message: "Artwork deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting artwork:", error);
    throw error;
  }
};
