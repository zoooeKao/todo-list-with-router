// @ts-check

import { useLoaderData } from 'react-router-dom';

export const useDataFromLoader = () => {
  return /** @type {null | { profile: import('../../model/global-state').Profile ,todoPayload: import('../../model/global-state').TodoState }} */ (
    useLoaderData()
  );
};
