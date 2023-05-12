const sanitizeProductRecord = (productRecord) => {
  const RECORD_ID = productRecord.id;
  const RECORD_FIELDS = productRecord.fields;

  //TODO: INSERT DATA VALIDATION AND HANDLING HERE

  const RET_VAL = {
    id: RECORD_ID,
    fields: RECORD_FIELDS,
  };

  return RET_VAL;
};

module.exports = {
  sanitizeProductRecord,
};
