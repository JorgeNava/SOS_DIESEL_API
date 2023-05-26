const {CATALOG_OPERATIONS} = require('../../../../../airtable-client-provider');

const getFiveProducts = async (req, res) => {
  try {
    const OPERATION_RESULT = await CATALOG_OPERATIONS.getAllProducts();
    if (Object.keys(OPERATION_RESULT).length || Array.isArray(OPERATION_RESULT)) {
      const RANDOM_PRODUCTS = getRandomElementsFromArray(OPERATION_RESULT, 5);
      res.status(200).send(RANDOM_PRODUCTS);
    } else {
      res.status(500).send({error: OPERATION_RESULT.message});
    }
  } catch (error) {
    console.error(error);
  }
};

function getRandomElementsFromArray(arr, numElements) {
  if (arr.length === 0) {
    return [];
  }

  if (numElements > arr.length) {
    numElements = arr.length;
  }

  const shuffledArray = arr.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray.slice(0, numElements);
}

module.exports = {
  getFiveProducts,
};
