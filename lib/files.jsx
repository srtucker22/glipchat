Images = new FS.Collection('images', {
  stores: [new FS.Store.FileSystem('images', {path: '~/uploads'})],
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
  insert: function() {
    // add custom authentication code here
    return true;
  },
});
