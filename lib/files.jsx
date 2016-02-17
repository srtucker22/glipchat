var imageStore = new FS.Store.GridFS('images');

Images = new FS.Collection('images', {
  stores: [imageStore],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});

Images.allow({
  download: function(userId, fileObj) {
    return true;
  },
  insert: function(userId) {
    // add custom authentication code here
    return !userId;
  },
});
