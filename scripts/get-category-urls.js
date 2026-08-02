require('dotenv').config();

const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  try {
    const result = await cloudinary.search
      .expression('folder:MenuDays/categories')
      .sort_by('public_id', 'asc')
      .max_results(100)
      .execute();

    const categories = result.resources.map((resource) => ({
      publicId: resource.public_id,
      secureUrl: resource.secure_url,
    }));

    console.log('\n========= CATEGORÍAS =========\n');
    console.log(JSON.stringify(categories, null, 2));
    console.log('\n==============================\n');
  } catch (error) {
    console.error(error);
  }
}

main();