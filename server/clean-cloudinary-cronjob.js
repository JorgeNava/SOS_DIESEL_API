const cron = require('node-cron');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "du1cxbsxb",
  api_key: "362398978389318",
  api_secret: "ERteTOBI33rmpfmhId9GPilxYXo"
});

//“At 00:00 on Sunday.”
cron.schedule('0 0 * * 0', async() => {
  console.log('Running cron job...');
  try {
    const { resources } = await cloudinary.api.resources({ max_results: 500 });

    for (const resource of resources) {
      await cloudinary.api.delete_resources(resource.public_id);
    }

    console.log('All assets deleted successfully.');
  } catch (error) {
    console.error('Error deleting assets:', error);
  }
});
