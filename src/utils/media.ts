import ImagePicker, { Image } from 'react-native-image-crop-picker';

export const pickAndCompressImages = async (): Promise<Image[]> => {
  try {
    const images = await ImagePicker.openPicker({
      multiple: true,
      minFiles: 5,
      maxFiles: 20,
      mediaType: 'photo',
      compressImageMaxWidth: 1600,
      compressImageMaxHeight: 1600,
      compressImageQuality: 0.7, // 70% quality as requested
      includeExif: false, // Explicitly strip EXIF to protect location privacy
      forceJpg: true, // Force JPG (strips some extra metadata/profiles)
    });

    // Check size limit: filter out images > 500 KB if necessary
    // react-native-image-crop-picker doesn't natively guarantee a hard size limit,
    // but dimensions + 70% quality usually hits 200-300KB for natural photos.
    const validImages = images.filter((img) => (img.size || 0) <= 500 * 1024);

    if (validImages.length < 5) {
      throw new Error('Please select at least 5 photos under 500KB each.');
    }

    return validImages;
  } catch (err) {
    console.error('Image picking error', err);
    throw err;
  }
};
