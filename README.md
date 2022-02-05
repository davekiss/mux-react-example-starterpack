[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/davekiss/mux-react-example-starterpack/tree/dk/engagement-stats)

# 1. Create a Signing Key for Mux Data

https://dashboard.mux.com/settings/signing-keys

# 2. Generate a JWT

`npm install base64url jsonwebtoken`

```javascript
const jwt = require("jsonwebtoken");
const base64 = require("base64url");

const privateKey = base64.decode(
  process.env.REACT_APP_MUX_DATA_SIGNING_KEY_SECRET
);
const keyId = process.env.REACT_APP_MUX_DATA_SIGNING_KEY_ID;
const livestreamId = "abc";

const token = jwt.sign(
  {
    sub: livestreamId,
    aud: "live_stream_id",
    exp: Date.now() + 600, // UNIX Epoch seconds when the token expires
    kid: keyId,
  },
  privateKey,
  { algorithm: "RS256" }
);

console.log(token);
```

# 3. Test it out

`curl 'https://stats.mux.com/counts?token={JWT}'`

You can get you Mux Data environment key here: https://dashboard.mux.com/environments
