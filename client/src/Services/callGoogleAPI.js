const callGoogleAPI = async (imageSrc) => {
    try {
      // Send the captured image to your backend API endpoint.
      const response = await fetch('http://ocr_api:5000/api/vision-ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // The API expects the image in JSON (here, it's the base64 data URL).
        body: JSON.stringify({ image: imageSrc })
      });
      
      // Parse the JSON response from the API.
      const data = await response.json();
      if(data.text){
        console.log(data.text)
        return(data.text)
      }
      else{
        return("No Text Found")
      }
    } catch (error) {
      console.error('OCR API error:', error);
    } 
  };
  export default callGoogleAPI;