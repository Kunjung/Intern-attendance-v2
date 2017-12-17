
let FACE_RECOGNITION_URL = 'https://acqdzcwzj4.execute-api.eu-west-2.amazonaws.com/prod/detectface';
let FACE_UPLOAD_URL = 'https://acqdzcwzj4.execute-api.eu-west-2.amazonaws.com/prod/uploadface';
let capture;
let container;

let takePictureButton;
let detectFaceButton;
let firstPictureButton;
let hasFace;
let hasUploaded;

let width = 320;
let height = 240;

// let width = 160;
// let height = 120;
let face;

let day;

function setup() {
  canvas = createCanvas(width*2, height);
  let constraints = {
    audio: false,
    video: {
      facingMode: "user"
    }
  };
  capture = createCapture(constraints);
  container = select('#container');
  takePictureButton = select('#takepicture');
  detectFaceButton = select('#detectface');
  firstPictureButton = select('#firstpicture');
  hasFace = select('#hasFace');
  hasUploaded = select('#hasUploaded');
  
  day = select('#day');

  face = createImage(width, height);
  
  capture.parent(container);
  canvas.parent(container);
  capture.size(width, height);

  capture.hide();

  
  takePictureButton.mousePressed(takePicture);
  detectFaceButton.mousePressed(detectFace);
  firstPictureButton.mousePressed(firstPicture);

}

//////////////////////////////////////////////////
////////////////////////////////////////////////

//// Uploading First Picture to the S3 Bucket ///////////
function firstPicture() {
  console.log("Uploading First Face");

  let intern_name = select('#intern_name').value();
  console.log(intern_name);
  if (intern_name == '') {
    hasUploaded.html("Please specify the intern's name");
    return null;
  }
  console.log(intern_name);
  
  face.loadPixels();
  let faceInBase64 = face.canvas.toDataURL("image/png");
  faceInBase64 = faceInBase64.replace(/^data:image\/(png|jpg);base64,/, "");
  //console.log(faceInBase64);


  let postData = {
    imgstr: faceInBase64,
    intern_name: intern_name
  }

  httpPost(FACE_UPLOAD_URL, 'json',
    postData,
    function (result) {
      console.log('result')
      hasUploaded.html(result);
      console.log(result);
      ;
    },
    function (error) {
      console.log('error');
      console.log(error);
    }
  );
}


///////////////////////////////////////
//////////////////////////////////////////


/// Check if the uploaded face contains a picture or not ///////////
function detectFace() {
  // TO DO
  // ******************************************************************
  // call the api by sending that picture with it
  console.log("Detecting Face.......");
  hasFace.html("Detecting Face. Please Wait.......");
  face.loadPixels();
  let faceInBase64 = face.canvas.toDataURL("image/png");
  faceInBase64 = faceInBase64.replace(/^data:image\/(png|jpg);base64,/, "");
  let daynumber = day.value();
  console.log(daynumber);
  //console.log(faceInBase64);

  let postData = {
    imgstr: faceInBase64,
    test: 1,
    day: daynumber
  }

  httpPost(FACE_RECOGNITION_URL, 'json',
    postData,
    function (result) {
      console.log('result')
      hasFace.html(result);
      console.log(result);
      ;
    },
    function (error) {
      console.log('error');
      console.log(error);
    }
  );

}

function takePicture() {
   
  console.log('Taking Picture');
  face = capture.get(0, 0, width, height);
}

function draw() {
  background(255);
  image(face, width, 0, width, height);

  push(); 
  translate(capture.width,0); 
  scale(-1.0,1.0); 
  image(capture.get(), 0, 0, width, height); 
  pop();

  //filter(BLUR, 3);
  filter(INVERT);
}
