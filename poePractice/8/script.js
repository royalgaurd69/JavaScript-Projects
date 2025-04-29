const images = [
    'images/image1.jpg',
    'images/image2.jpg',
    'images/image3.jpg',
    'images/image4.jpg',
    'images/image5.jpeg'
];

let currentIndex = 0;

const sliderImage = document.getElementById('slider-image');
const imageCounter = document.getElementById('image-counter');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

prevBtn.addEventListener('click', showPreviousImage);
nextBtn.addEventListener('click', showNextImage);

function showImage(index) {
    sliderImage.src = images[index];
    imageCounter.textContent = `Image ${index + 1} of ${images.length}`;
}

function showPreviousImage() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }
    showImage(currentIndex);
}

function showNextImage() {
    currentIndex++;
    if (currentIndex >= images.length) {
        currentIndex = 0;
    }
    showImage(currentIndex);
}
