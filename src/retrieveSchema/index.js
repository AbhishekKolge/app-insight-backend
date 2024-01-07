const user = {
  id: true,
  name: true,
  email: true,
  dob: true,
  profileImage: true,
  profileImageId: true,
  isVerified: true,
  verified: true,
};

const report = {
  id: true,
  name: true,
  rating: true,
  reviewCount: true,
  size: true,
  installCount: true,
  type: true,
  price: true,
  currency: true,
  updatedAt: true,
  currentVersion: true,
  androidVersion: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  contentRating: {
    select: {
      id: true,
      name: true,
    },
  },
  genre: {
    select: {
      id: true,
      name: true,
    },
  },
};

const topAppsByCategory = {
  id: true,
  name: true,
  installCount: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
};

const topAppsByRating = {
  id: true,
  name: true,
  installCount: true,
  rating: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
};

const topExpensiveApps = {
  id: true,
  name: true,
  price: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
};

const topReviewedApps = {
  id: true,
  name: true,
  reviewCount: true,
};

const topCommentedApps = {
  id: true,
  name: true,
  reviews: true,
};

module.exports = {
  user,
  report,
  topAppsByCategory,
  topAppsByRating,
  topExpensiveApps,
  topReviewedApps,
  topCommentedApps,
};
