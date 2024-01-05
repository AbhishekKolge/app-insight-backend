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

module.exports = {
  user,
  report,
};
