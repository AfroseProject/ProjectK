const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sharp = require("sharp");
const os = require("os");
const path = require("path");
const fs = require("fs");

admin.initializeApp();

exports.getPrivateListingData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
  }

  const { listingId } = data;
  if (!listingId) {
    throw new functions.https.HttpsError("invalid-argument", "Listing ID is required.");
  }

  const db = admin.firestore();

  const listing = await db.collection("listings").doc(listingId).get();
  if (!listing.exists || listing.data().status !== "active") {
    throw new functions.https.HttpsError("permission-denied", "Listing unavailable.");
  }

  const enquiryRef = db.collection("enquiries").doc();
  await enquiryRef.set({
    enquiryId: enquiryRef.id,
    listingId: listingId,
    responderId: context.auth.uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const privateDoc = await db.collection("listing_private").doc(listingId).get();
  if (!privateDoc.exists) {
    throw new functions.https.HttpsError("not-found", "Private listing data not found.");
  }

  const { ownerPhone } = privateDoc.data();
  
  const message = encodeURIComponent(`Hello, I'm interested in your land clearance listing (ID: ${listingId})`);
  const whatsappUrl = `whatsapp://send?phone=${ownerPhone}&text=${message}`;

  return { whatsappUrl };
});

exports.onListingDeleted = functions.firestore
  .document("listings/{listingId}")
  .onDelete(async (snap, context) => {
    const { listingId } = context.params;
    const bucket = admin.storage().bucket();
    
    try {
      await bucket.deleteFiles({ prefix: `listings/${listingId}/` });
      console.log(`Cleaned up images for deleted listing ${listingId}`);
    } catch (err) {
      console.error(`Failed to delete images for ${listingId}`, err);
    }
});

exports.validateListing = functions.firestore
  .document("listings/{listingId}")
  .onWrite(async (change, context) => {
    if (!change.after.exists) return;
    
    const data = change.after.data();
    
    if (data.status === 'active' && (!data.photoThumbs || data.photoThumbs.length < 5)) {
      console.warn(`Listing ${context.params.listingId} set to active without 5 images. Reverting to draft.`);
      return change.after.ref.update({ status: 'draft' });
    }
});

exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;

  if (!filePath || !filePath.includes("/originals/")) {
    return null;
  }

  const bucket = admin.storage().bucket();
  const listingId = filePath.split("/")[1];
  const fileName = path.basename(filePath);

  const tempFile = path.join(os.tmpdir(), fileName);
  const thumbFile = `thumb_${fileName}`;
  const thumbTemp = path.join(os.tmpdir(), thumbFile);

  console.log(`Generating thumbnail: ${filePath}`);

  await bucket.file(filePath).download({ destination: tempFile });

  await sharp(tempFile)
    .resize(400, 400, { fit: "cover" })
    .jpeg({ quality: 70 })
    .withMetadata(false)
    .toFile(thumbTemp);

  const finalThumbPath = `listings/${listingId}/thumbs/${thumbFile}`;

  await bucket.upload(thumbTemp, {
    destination: finalThumbPath,
    metadata: { contentType: "image/jpeg" }
  });

  await admin.firestore()
    .collection("listings")
    .doc(listingId)
    .update({
      photoThumbs: admin.firestore.FieldValue.arrayUnion(finalThumbPath)
    });

  fs.unlinkSync(tempFile);
  fs.unlinkSync(thumbTemp);

  console.log(`Thumbnail completed: ${finalThumbPath}`);

  return null;
});
