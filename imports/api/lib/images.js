import { UploadFS } from 'meteor/jalik:ufs';
import { Mongo } from 'meteor/mongo';

// Set default permissions for all stores (you can later overwrite the default permissions on each store)
UploadFS.config.defaultStorePermissions = new UploadFS.StorePermissions({
  insert (userId, doc) {
    return true;
  },
  update (userId, doc) {
    return true;
  },
  remove (userId, doc) {
    return true;
  },
});

// Use HTTPS in URLs
UploadFS.config.https = true;

// This path will be appended to the site URL, be sure to not put a "/" as first character
// for example, a PNG file with the _id 12345 in the "photos" store will be available via this URL :
// http://www.yourdomain.com/uploads/photos/12345.png
UploadFS.config.storesPath = 'uploads';

export const Images = new Mongo.Collection('images');

Images.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

export const ImageStore = new UploadFS.store.GridFS({
  collection: Images,
  name: 'images',
  chunkSize: 1024 * 255,
  path: '/uploads/images',
  // Apply a filter to restrict file upload
  filter: new UploadFS.Filter({
    minSize: 1,
    maxSize: 1024 * 1000, // 1MB,
    contentTypes: ['image/*'],
    extensions: ['jpg', 'png'],
  }),
});

export default Images;
