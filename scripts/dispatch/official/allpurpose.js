import { modifyAll } from "./scriptUtil";

const main = async () => {
  const f = ({ derived, ...rest }) => ({
    ...rest,
    ...derived,
  });
  modifyAll(f);
};

main();
