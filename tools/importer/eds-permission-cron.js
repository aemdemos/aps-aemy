function greet(name) {
  const fromCron = process.env.FROMCRON;
  console.log(`Hello, ${name}! fromCron: ${fromCron}`);
}

// Call the method directly
greet('GitHub');
