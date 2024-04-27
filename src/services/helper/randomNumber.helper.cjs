exports.getRandomNumber = () => {
    // Generate a random number between 0 (inclusive) and 1 (exclusive)
    const randomNumber = Math.random();
  
    // Scale the random number to be between 3 and 5
    const scaledNumber = randomNumber * (5 - 3) + 3;
  
    // Round the number to the nearest integer
    const roundedNumber = Math.round(scaledNumber);
  
    return roundedNumber;
  }