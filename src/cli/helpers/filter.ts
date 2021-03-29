export const filterPayload = (input: string, existingPayloads: string[]) => {
  const payloads = input.split(',');
  const trimmedPayloads = payloads.map(payload => payload.trim());
  const uniquePayloads = trimmedPayloads.filter(payload => !existingPayloads.find(ep => payload === ep));

  if (trimmedPayloads.length - uniquePayloads.length > 0) {
    const rejectedPayloads = trimmedPayloads.filter(p => !uniquePayloads.find(u => u === p));
    console.log('\nThese payloads already exist and were rejected:', rejectedPayloads);
  }

  return uniquePayloads;
};
