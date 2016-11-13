import {FilesCollection} from 'meteor/ostrio:files';
import Grid from 'gridfs-stream';
import fs from 'fs';
import {MongoInternals} from 'meteor/mongo';

// Set up gfs instance
let gfs;
if (Meteor.isServer) {
  gfs = Grid(
    MongoInternals.defaultRemoteCollectionDriver().mongo.db,
    MongoInternals.NpmModule
  );
}

const Images = new FilesCollection({
  debug: true,
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  cacheControl: 'public, max-age=31536000',
  protected(fileObj) {
    // TODO: need to add security here
    // this.userId currently returns null -- seems to be a ostrio:files issue
    // console.log(this.userId, this.user());
    // Check if user owns this file
    // if (!!fileObj && fileObj.meta.owner === this.userId) {
    //   return true;
    // } else {
    //   return false;
    // }
    return true;
  },
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  },
  onAfterUpload(image) {
    // Move file to GridFS
    Object.keys(image.versions).forEach((versionName) => {
      const metadata = {
        versionName, imageId: image._id, storedAt: new Date(),
      }; // Optional

      const writeStream = gfs.createWriteStream({
        filename: image.name,
        metadata,
      });

      fs.createReadStream(image.versions[versionName].path).pipe(writeStream);

      writeStream.on('close', Meteor.bindEnvironment((file) => {
        const property = `versions.${versionName}.meta.gridFsFileId`;

        // If we store the ObjectID itself, Meteor (EJSON?) seems to convert to
        // LocalCollection.ObjectID, which GFS doesn't understand.
        this.collection.update(image._id, {
          $set: {[property]: file._id.toString()},
        });

        // Unlink files from FS
        this.unlink(this.collection.findOne(image._id), versionName);
      }));
    });
  },
  interceptDownload(http, image, versionName) {
    const _id = (image.versions[versionName].meta || {}).gridFsFileId;
    if (_id) {
      const readStream = gfs.createReadStream({_id});
      readStream.on('error', (err) => {
        throw err;
      });
      readStream.pipe(http.response);
    }

    // Serve file from either GridFS or FS if it wasn't uploaded yet
    return Boolean(_id);
  },
});

// Set up gfs instance
if (Meteor.isServer) {
  Images.denyClient();
}

export default Images;
