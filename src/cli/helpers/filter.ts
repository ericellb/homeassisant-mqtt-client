export const filterPayload = (input: string, existingPayloads: string[]) => {
  const payloads = input.split(',');
  const trimmedPayloads = payloads.map(payload => payload.trim());
  const rejectedPayloads: string[] = [];
  const uniquePayloads = trimmedPayloads
    .map(payload => {
      const exists = existingPayloads.find(
        existingPayload => payload.toLocaleLowerCase() === existingPayload.toLocaleLowerCase()
      );
      if (exists) {
        rejectedPayloads.push(payload);
      }
      return exists ? undefined : payload;
    })
    .filter(payload => payload !== undefined);

  if (rejectedPayloads.length > 0) {
    console.log('\nThe following payloads already exist and have not been added for this event:\n', rejectedPayloads);
  }

  return uniquePayloads;
};
