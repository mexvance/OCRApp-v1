
import levenshtein from 'damerau-levenshtein'
function compareValues(input, imageText) {
    // Replace this with your actual database query logic.
    // For example, using a library like mysql or pg.
    console.log(`comparing input: ${input} with image text: ${imageText}`);
    const lev  = levenshtein(input,imageText)
    console.log(lev)
    return lev; // Return the result from the query.
  }
  export default compareValues