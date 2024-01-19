const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const contents = path.join(
  __dirname,
  "./node_modules/payed-grpc/account_profile.proto"
);
const packageDefinitionReci = protoLoader.loadSync(contents, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const t = grpc.loadPackageDefinition(packageDefinitionReci);

const accountProfileServiceClient =
  new t.payed_grpc.account_profiles.AccountProfile(
    "grpc.getpayed.co:443",
    grpc.credentials.createSsl(null, null, null, null)
  );

const clientId = "clientId";
const clientSecret = "clientSecret";
const basicToken = Buffer.from(`${clientId}:${clientSecret}`).toString(
  "base64"
);
const metadata = new grpc.Metadata();
metadata.set("authorization", `Basic ${basicToken}`);

accountProfileServiceClient.fetchProfileToProfileTransferByReference(
  {
    amount: 200.0,
    destinationAccountProfileId: "74",
    originAccountProfileId: "1",
    purpose: "Airtime Payment",
    reference:
      "83546da30e81be25d0e75dceb02a5e472d1a618e9d5f602448fe4905ca32c105",
  },
  metadata,
  (err, feedback) => {
    if (err) {
      console.log(`err ${err.toString()}`);
      return;
    }
    console.log("Found a recipe:");
    console.log(feedback);
    console.log("Processing...");
  }
);
