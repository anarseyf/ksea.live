import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const f = async () => {
  const client = new SecretsManagerClient();
  const input = { SecretId: "test1" };
  const command = new GetSecretValueCommand(input);
  const result = await client.send(command);
  console.log(`AWS client: ${result.Name} -> ${result.SecretString}`);
};

f();
