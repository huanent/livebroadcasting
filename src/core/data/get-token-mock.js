export let tokenPool = [
  {
    user_id: "1",
    tx_user_id: "1",
    state: "0",
    tx_token:
      "eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwoZQweKU7MSCgswUJStDEwMDYxNLczMDiExqRUFmUSpQ3NTU1MjAACpakpkLFrMwNzYzMzC3gJqSmQ400zw5qSDR0yIgJMy81CWqOMqkwDLY2Ck1J9Izwr8iNSissjgoMMIvO6AyzMRWqRYADcIv1Q__"
  },
  {
    user_id: "2",
    tx_user_id: "2",
    state: "0",
    tx_token:
      "eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zIhwlDB4pTsxIKCzBQlK0MTAwNjE0tzMwOITGpFQWZRKlDc1NTUyMAAKlqSmQsWszA3NjMzNDCDmpKZDjSzKKTKyTTdMdIxyMC0IFDb18LcsMDNIMc1Ij3E3DK0SrvUN8rHsMgpK8Aj2VapFgDvBS6H"
  },
  {
    user_id: "3",
    tx_user_id: "3",
    state: "0",
    tx_token:
      "eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwsZQweKU7MSCgswUJStDEwMDYxNLczMDiExqRUFmUSpQ3NTU1MjAACpakpkLFrMwNzYzMzQygZqSmQ40syg4OMclJCfFKaDYv9C4tDLDNDEo263Mv6I4IjS4rMo8K9AwJzinssDb0tNWqRYAKrkwsA__"
  },
  {
    user_id: "4",
    tx_user_id: "4",
    state: "0",
    tx_token:
      "eJwtzL0KwjAYheF7yaq0aX5NwUlQEIWKOihdKon1o0RCGyUq3rslZjzPgfeDDpt99jQ9KhHJMJrGDdrcPVwhMks46K5xDjQqC4YxZUoK-H9McNCb0TnnBOOkHmy0maRCFKJIFWjH5vas6vxhhVzvRDBvWucrfrFBNsfQLn1VBUW62wsmp*AWwxx9f2ZnMH4_"
  },
  {
    user_id: "5",
    tx_user_id: "5",
    state: "0",
    tx_token:
      "eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwqZQweKU7MSCgswUJStDEwMDYxNLczMDiExqRUFmUSpQ3NTU1MjAACpakpkLFrMwNzYzMzQ3gZqSmQ400zPS1buquCRG36W8MsqxpDDUL0vbMz2wJDHEPdjV27Lc0tFc2yMrzd*1vMTXVqkWAEi0MA4_"
  },
  {
    user_id: "6",
    tx_user_id: "6",
    state: "0",
    tx_token:
      "eJwtzE0LgkAUheH-ctdhM6MzfoAbw5W2MoKgTemM3sIavCZG9N8Tm*V5DrwfOJSVN*kBEhAeg826sdGPEQ2urBxSc79Yiw0kPGDMD*JQsf*jZ4uDXlxKKRhzOmK-WhT6SgnulLBdmvppztuWyHbvrB6HMouu4mjoVtS7*NUVp5xmpKqfuMz3KXx-YkAw-g__"
  },
  {
    user_id: "7",
    tx_user_id: "7",
    state: "0",
    tx_token:
      "eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwuZQweKU7MSCgswUJStDEwMDYxNLczMDiExqRUFmUSpQ3NTU1MjAACpakpkLFrMwNzYzMzIyhJqSmQ40M8gnL8DNwtWwODLCqLg8stI5Ja0sKsrUy8QvwNTQ0SUoNcqnojjUK8gvydVWqRYABfEvPg__"
  }
];

const sdkAppId = "1400360542";

const userId = tokenPool[3].user_id;
const tx_user_id = tokenPool[3].tx_user_id;
const roomId = "1234567890";
const tx_token = tokenPool[3].tx_token;

const privateMapKey = (Math.random() * 10).toString();

export const getMockIdleToken = function() {
  return new Promise(resolve => {
    resolve({
      data: {
        model: {
          tx_user_id: tx_user_id,
          tx_token: tx_token,
          privateMapKey: privateMapKey
        },
        dataChange: false,
        success: true,
        messages: [],
        fieldErrors: []
      }
    });
  });
};
export const createRoomMock = function() {
  return new Promise(resolve => {
    resolve({
      data: {
        model: {
          roomId: roomId
        },
        dataChange: false,
        success: true,
        messages: [],
        fieldErrors: []
      }
    });
  });
};
export const getSdkAppIdMock = function() {
  return sdkAppId;
};
