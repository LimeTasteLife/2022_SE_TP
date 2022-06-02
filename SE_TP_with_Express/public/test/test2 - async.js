async function hi() {
  for (i = 0; i < 100; i++) {
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    console.log(i);
  }
}

hi();
