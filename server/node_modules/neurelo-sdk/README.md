# Neurelo TypeScript/JavaScript SDK

Neurelo's TypeScript/JavaScript SDK allows you to quickly and easily integrate your app with Neurelo APIs. This SDK is generated from the API spec and provides a set of methods to interact with the API endpoints.

Please refer to all the available examples here: [Neurelo SDK Examples 🔗](https://github.com/neurelo-public/neurelo-sdk-examples)

- These examples are built to act as a starter template for your project
- You can use these examples to understand how to use the SDK in your project

This generator creates a TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node-Module can be used in the following environments:

### Environment

- Node.js
- Webpack
- Browserify

### Language target

- ES5+

### Module system

- CommonJS
- ES2020

The definition should be automatically resolved via `package.json` at the time of installation, so you don't have to add `axios` in your package dependencies, if you don't want to pass a custom axios instance.

## Prerequisites:

- Download your generated SDK from the API Documentation page of your project & move generated SDK file `neurelo-sdk-typescript-cmt_<id>.tgz` to your project root.
- Tools for configuring environment variables (e.g. [dotenv](https://www.npmjs.com/package/dotenv)) or simply export before starting your dev server (inline).

## Installation:

- Commit the `.tgz` file along with package.json and package-lock.json changes.
- Install the SDK using npm or yarn:
  > - NPM
  >
  > ```sh
  > npm i ./neurelo-sdk-typescript-cmt_<id>.tgz
  > ```
  >
  > - YARN
  >
  > ```sh
  > yarn add ./neurelo-sdk-typescript-cmt_<id>.tgz
  > ```

## Modifications:

### Modifying API configuration

- To modify the `Api Key` you can edit environment variable : `NEURELO_API_KEY`
- To modify the `Base Path` you can edit environment variable : `NEURELO_API_BASE_PATH`

### Interceptors for axios (Request and Response)

- To modify the axios config, you can create a `neurelo.config.ts` or `neurelo.config.js` file in your project's root directory.
- Configuration file should export `AxiosInstance` using `customAxios` variable. If you don't export `AxiosInstance`, the packaged SDK will use an internal version of `axios`.

> Note: Neurelo's TypeScript/JavaScript SDK will be using an internal version of axios if you don't install it or don't export `AxiosInstance` using `customAxios` variable.

- Here is an example:
```tsx
/* Module System: ESM */
/* neurelo.config.ts */

import axios from 'axios';

export const customAxios = axios.create({
  withCredentials: true,
});

customAxios.interceptors.response.use(
  (response) => {
    console.log('response', response);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
``` 
```js
/* Module System: CommonJs */
/* neurelo.config.js */

const axios = require("axios");

const customAxios = axios.create({
  withCredentials: true,
});

customAxios.interceptors.response.use(
  (response) => {
    // console.log('response', response);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

module.exports = {
  customAxios,
};
```

## Getting Started:

- Using the SDK in your TypeScript/JavaScript project:

To see a full example application built with `next.js | express | cra`, please visit [Neurelo SDK Example 🔗](https://github.com/neurelo-public/neurelo-sdk-examples/)
  
---

```tsx
/* ESM */

import { GenericError, SafeError } from '@/types/generic';
import { Address, AddressApiService } from 'neurelo-sdk';

const getAddresses = async ({
  search,
}: {
  search: string;
}): Promise<[Address[] | undefined, SafeError | undefined]> => {
  try {
    const res = await AddressApiService.findAddress(undefined, {
      OR: [
        {
          address: {
            contains: search,
          },
        },
        // ...otherConditions
      ],
    });
    return [res.data.data, undefined];
  } catch (error) {
    const err = error as GenericError;
    return [
      undefined,
      { message: err.response.data?.errors?.[0]?.error || 'Encountered generic error' },
    ];
  }
};

export const UpdateAddressForm = async () => {
  const [data, error] = await getAddresses({ search: '1145' });

  // Handle error
  if (error) {
    return <div>{error.message}</div>;
  }

  // Handle success
  if (data) {
    return (
      <div>
        {data.map((address) => (
          <div key={address.address_id}>{address?.postal_code || '--'}</div>
        ))}
      </div>
    );
  }
};
```
```jsx
/* CommonJs */

const { Address, AddressApiService } = require("neurelo-sdk");

const getAddresses = async ({
  search,
}) => {
  try {
    const res = await AddressApiService.findAddress(undefined, {
      OR: [
        {
          address: {
            contains: search,
          },
        },
        // ...otherConditions
      ],
    });
    return [res.data?.data, undefined];
  } catch (error) {
    const err = error as GenericError;
    return [
      undefined,
      {
        message:
          err.response.data?.errors?.[0]?.error ||
          "Encountered generic error",
      },
    ];
  }
};

export const UpdateAddressForm = async () => {
  const [data, error] = await getAddresses({ search: "1145" });

  // Handle error
  if (error) {
    return <div>{error.message}</div>;
  }

  // Handle success
  if (data) {
    return (
      <div>
        {data.map((address) => (
          <div key={address.address_id}>{address?.postal_code || "--"}</div>
        ))}
      </div>
    );
  }
};
```
