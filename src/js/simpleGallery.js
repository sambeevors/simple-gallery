const simpleGallery = (() => {
  let autoplay
  let imageCount
  let currentImage
  let currentSlide = 1
  let userControl = true
  let renderedImage = []
  const galleryFrame = document.querySelector('.js-gallery-frame') // The container for all the markup
  const gallery = document.querySelector('.js-gallery') // Where the images are appended to

  // Initialises the app
  const init = config => {
    switch (true) {
      // Case for when no settings are set
      case ( typeof config.images !== 'undefined' && typeof config.settings === 'undefined'):
        _createGallery(_configureSettings({}), config.images)
        break
      // Case for when both images and settings are set
      case ( typeof config.images !== 'undefined' && typeof config.settings !== 'undefined'):
        _createGallery(_configureSettings(config.settings), config.images)
        break
      // If images aren't set, fail
      default:
        let errorMessage = document.createElement('span')
        errorMessage.textContent = 'ERROR: No images passed.'
        errorMessage.classList.add('simple-gallery__error')
        galleryFrame.appendChild(errorMessage)
        return
    }

    // Once the images have been added, add appropriate event listeners
    _eventListeners(config.images)

    // Check how many images there are to be cycled through
    imageCount = config.images.length

    // Set autoplay if it is necessary (default true)
    autoplay = (typeof config.settings !== 'undefined' && typeof config.settings.autoplay !== 'undefined' ? config.settings.autoplay : true)
  }

  // Constructor function for user settings
  function Settings () {
    // Default settings
    this.speed = 5000,
    this.arrows = true,
    this.autoplay = true
  }

  const _configureSettings = userSettings => {
    // Create settings from defaults
    const gallerySettings = new Settings()

    // Overwrite default settings with user settings
    for (let key in gallerySettings) {
      if (!gallerySettings.hasOwnProperty(key)) continue
      if (key in userSettings) {
        gallerySettings[key] = userSettings[key]
      }
    }

    return gallerySettings
  }

  const _eventListeners = images => {
    // Recalculate sizes on page resize
    window.addEventListener('resize', () => {
      images.forEach(_setImages)
    })

    // Cycles gallery manually on arrow key press
    window.addEventListener('keydown', (e) => {
      let event = window.event ? window.event : e

      if (event.keyCode === 39 || event.keyCode === 37) {
        // Stops autoplay on arrow key press
        _stopGallery()

        let direction = (event.keyCode === 39 ? 'right' : 'left')
        _cycleGallery(direction)
      }
    })

    if (userControl === true) {
      // Event listener for left button press
      document.querySelector('.js-gallery-left').addEventListener('click', () => {
        _stopGallery()
        _cycleGallery('left')
      })

      // Event listener for right button press
      document.querySelector('.js-gallery-right').addEventListener('click', () => {
        _stopGallery()
        _cycleGallery('right')
      })
    }
  }

  // Creates the gallery from supplied images
  const _createGallery = (settings, images) => {

    // Removes buttons if set in settings
    const buttons = document.querySelector('.js-gallery-buttons')
    if (settings.arrows === false) {
      buttons.parentNode.removeChild(buttons)
      userControl = false
    }

    // Sets all the images into the gallery
    images.forEach(_setImages)
    // Starts the gallery once it's been created
    _startGallery(settings)
  }

  // Constructor function for creating new slides in the gallery
  function ImageMarkup () {
    this.imgId // Identifier used for each image
    this.imgSrc // Source of the image to show
    this.imgAlt // Alt text for the image
    this.imgDesc; // Description of the image (optional)
    // Check if image with this ID already exists
    this.imgExists = () => {
      if (document.querySelector(`.js-slide-${this.imgId}`)) {
        return true
      }
      return false
    }
    this.renderImg = () => {
      // Ensures the element doesn't already exists before adding it
      if (!this.imgExists()) {
        // Create a new image with appropriate markup
        let imgContainer = document.createElement('div')
        imgContainer.classList.add(
          `js-slide-${this.imgId}`,
          `js-gallery-image`,
          `simple-gallery__images__container`
        )

        let img = document.createElement('img')
        img.classList.add(
          `js-image-${this.imgId}`,
          `simple-gallery__images__image`
        )
        img.src = this.imgSrc
        img.alt = this.imgAlt
        imgContainer.appendChild(img)

        // If a custom description has been set, add it to the slide
        if (this.imgDesc !== undefined) {
          let span = document.createElement('span')
          span.textContent = this.imgDesc
          imgContainer.appendChild(span)
        }
        // Adds the image to an array of rendered images
        renderedImage.push(imgContainer)
        // Renders the image
        gallery.appendChild(imgContainer)
      }
    }
    // Identifying class for this image (based on it's ID)
    this.imgIdentifyingClass = () => {
      return `.js-image-${this.imgId}`
    }
  }

  // Inserts images into the gallery and resizes them appropriately
  const _setImages = (image, index, array) => {
    // Create a new image
    let newImage = new ImageMarkup()

    // Set attributes for new image
    newImage.imgId = index + 1
    newImage.imgSrc = image['url']
    newImage.imgAlt = image['alt']
    newImage.imgDesc = image['desc']

    // Render the new image
    newImage.renderImg()

    // Select the image we just created
    currentImage = document.querySelector(newImage.imgIdentifyingClass())

    // Calculates the aspect ratio of an image
    const calculateAspectRatio = (srcWidth, srcHeight, maxWidth, maxHeight) => {
      return Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
    }

    let aspectRatio = calculateAspectRatio(
      currentImage.width,
      currentImage.height,
      gallery.offsetWidth,
      gallery.offsetHeight
    )

    // Sets image dimensions based on width of gallery and aspect ratio
    if (currentImage.height > currentImage.width) {
      currentImage.style.width = gallery.offsetWidth + 'px'
      currentImage.style.height = currentImage.height * aspectRatio + 'px !important'
    } else {
      currentImage.style.height = gallery.offsetHeight + 'px'
      currentImage.style.width = gallery.offsetWidth * aspectRatio + 'px !important'
    }
  }

  const _startGallery = settings => {
    // Autoplays the gallery
    window.setInterval(() => {
      if (autoplay === true) {
        _cycleGallery('right')
      }
    }, settings.speed)
  }

  const _stopGallery = () => {
    return autoplay = false
  }

  // Cycles gallery in desired direction
  const _cycleGallery = direction => {
    if (direction === 'left') {
      currentSlide--

      if (currentSlide <= 0) {
        currentSlide = imageCount
      }
    } else if (direction === 'right') {
      currentSlide++

      if (currentSlide > imageCount) {
        currentSlide = 1
      }
    }

    for (let i = 0; i < imageCount; i++) {
      // Hides all the images
      renderedImage[i].classList.add('hide')
    }

    // Shows the new image
    currentImage = document.querySelector(`.js-slide-${currentSlide}`)
    currentImage.classList.remove('hide')
  }

  // Allows the app to be initialized
  return { init }
})()
