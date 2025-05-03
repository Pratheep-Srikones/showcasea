import { deleteImage } from "@/lib/cloud/cloudinary";
import { ArtWork } from "@/db/models/artwork.model";
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

export const getArtWorksbyTag = async (tag: string) => {
  try {
    const artworks = await ArtWork.find({ tags: tag })
      .populate("artist", {
        first_name: 1,
        last_name: 1,
        profile_picture_url: 1,
      })
      .sort({ createdAt: -1 });

    if (!artworks || artworks.length === 0) {
      console.error("No artworks found for the given tag:", tag);
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No artworks found for the given tag",
      });
    }
    return artworks;
  } catch (error) {
    console.error("Error fetching artworks for tag:", tag, error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while fetching artworks",
    });
  }
};

export const getArtWorkSortedBy = async (sortBy: string) => {
  if (!["createdAt", "viewCount", "likeCount", "viewCount"].includes(sortBy)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid sort parameter",
    });
  }
  try {
    const artworks = await ArtWork.find({})
      .populate("artist", {
        first_name: 1,
        last_name: 1,
        profile_picture_url: 1,
      })
      .sort({ [sortBy]: -1 });

    if (!artworks || artworks.length === 0) {
      console.error("No artworks found for the given sort parameter:", sortBy);
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No artworks found for the given sort parameter",
      });
    }
    return artworks;
  } catch (error) {
    console.error("Error fetching artworks sorted by:", sortBy, error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while fetching artworks",
    });
  }
};

export const getFilteredArtWorkCount = async (tag: string) => {
  try {
    const count =
      tag === "all"
        ? await ArtWork.countDocuments({})
        : await ArtWork.countDocuments({ tags: tag });
    return count;
  } catch (error) {
    console.log("Error counting", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while fetching artworks",
    });
  }
};

export const getFilteredArtworks = async (
  tag: string,
  sortBy: string,
  start: number,
  offset: number
) => {
  if (!["createdAt", "viewCount", "likeCount"].includes(sortBy)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid sort parameter",
    });
  }

  try {
    const filter = tag === "all" ? {} : { tags: tag };
    const artworks = await ArtWork.find(filter)
      .populate("artist", {
        first_name: 1,
        last_name: 1,
        profile_picture_url: 1,
        username: 1,
      })
      .sort({ [sortBy]: -1 })
      .skip(start)
      .limit(offset);

    return artworks;
  } catch (error) {
    console.error("Error fetching filtered artworks:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while fetching artworks",
    });
  }
};

export const getSuggestedArtworks = async (
  userId: string,
  start: number,
  offset: number
) => {
  try {
    const artworks = await ArtWork.find({ artist: { $ne: userId } })
      .populate("artist", {
        first_name: 1,
        last_name: 1,
        profile_picture_url: 1,
        username: 1,
      })
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(offset);

    return artworks;
  } catch (error) {
    console.error("Error fetching suggested artworks:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while fetching suggested artworks",
    });
  }
};
