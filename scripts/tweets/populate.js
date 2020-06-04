const asyncTimeout = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

const populate = () => {
  const interval = 1000;
  let counter = { i: 0 };
  let id;
  const tick = async () => {
    const current = counter.i;
    console.log(`TICK ${current}...`);
    await asyncTimeout(2000);
    console.log(`TICK ${current} done`);
    counter.i++;
    if (current >= 3) {
      console.log("DONE at ", current);
      clearInterval(id);
    }
  };
  id = setInterval(tick, interval);
};

populate();
