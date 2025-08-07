// Toggle class menu
$(function () {
    $('.menu').on('click', function () {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $('.ss-menu1').addClass('visible1');
            $('.ss-menu2').addClass('visible2');
            $('.ss-menu3').addClass('visible3');
            $('.ss-menu4').addClass('visible4');
            $('.ss-menu5').addClass('visible5');
            $('.ss-menu6').addClass('visible6');
        } else {
            $('.ss-menu1').removeClass('visible1');
            $('.ss-menu2').removeClass('visible2');
            $('.ss-menu3').removeClass('visible3');
            $('.ss-menu4').removeClass('visible4');
            $('.ss-menu5').removeClass('visible5');
            $('.ss-menu6').removeClass('visible6');
        }
    })
})
$(function () {
    $('.ss-menu').on('click', function () {
      $('.menu').removeClass('active');
      $('.ss-menu1').removeClass('visible1');
      $('.ss-menu2').removeClass('visible2');
      $('.ss-menu3').removeClass('visible3');
      $('.ss-menu4').removeClass('visible4');
      $('.ss-menu5').removeClass('visible5');
      $('.ss-menu6').removeClass('visible6');
    })
})
$(function () {
    $(window).on('scroll', function () {
        if ($('.menu').hasClass('active')) {
          $('.menu').removeClass('active');
          $('.ss-menu1').removeClass('visible1');
          $('.ss-menu2').removeClass('visible2');
          $('.ss-menu3').removeClass('visible3');
          $('.ss-menu4').removeClass('visible4');
          $('.ss-menu5').removeClass('visible5');
          $('.ss-menu6').removeClass('visible6');
        }
    })
})

// Parallax effect and gsap
$(function () {
  if (!window.location.pathname.match("mentions")) {
    $('.rellax').css('transform', 'translateX(-50%)');
    var rellax = new Rellax('.rellax');
  }
})

// Script adresse Email
// Listener pour chargement adresse mailto
window.addEventListener("load", function () {
  const myMailElems = document.querySelectorAll('.insertMail');
  myMailElems.forEach(divMail => {
    let name = "sickdaysbrno" ; // Update yours informations here
    let domain = "gmail.com" ; // Update yours informations here
    let newAhref = document.createElement('a');
    newAhref.href = "mailto:" + name + '@' + domain;
    newAhref.innerHTML = name + '@' + domain;
    divMail.appendChild(newAhref);
  });
})

document.addEventListener('DOMContentLoaded', () => {
  const currentDateElement = document.getElementById('currentDate');
  const showsTableBody = document.querySelector('#showsTable tbody');
  const merchContainer = document.getElementById('merchContainer');

  // --- Gallery Modal Logic (Updated) ---
  const modal = document.getElementById('imageModal');
  const modalImage = document.querySelector('.modal-image');
  const modalCaption = document.querySelector('.modal-caption');
  const closeBtn = document.querySelector('.modal-close-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  // These will hold the images for the currently active set (gallery or merch)
  let currentImageSet = [];
  let currentIndex = 0; // Variable to store the index of the current image
  const galleryItems = []

  function setupGallery() {
     const galleryItemsDiv = document.querySelectorAll('.gallery-item');

      // Add click listener to each gallery item
      galleryItemsDiv.forEach((itemDiv, index) => {
          const item = itemDiv.querySelector('img');
          galleryItems.push(item.src)
          itemDiv.addEventListener('click', (event) => {
              event.preventDefault();

              // Populate the global image set for the gallery
              currentImageSet = galleryItems;
              currentIndex = index;
              openModal(item.src, item.alt);
          });
      });
  }


  // Path to your YAML file
  const yamlFilePath = 'config.yaml'; // Make sure this path is correct

  fetch(yamlFilePath)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
      })
      .then(yamlText => {
          // Parse the YAML text
          const configDataRoot = jsyaml.load(yamlText);
          currentDateElement.textContent = configDataRoot.creation_date

          // populate band members cards
          const membersContainer = document.getElementById('membersContainer');
          membersContainer.innerHTML = ''; // Clear existing content

          membersData = configDataRoot.band_members
          membersData.forEach(member => {
                    const cardDiv = document.createElement('div');
                    cardDiv.classList.add('card', 'animatableY'); // Add your CSS classes

                    // Image (lazyload and noscript)
                    const imgLazyload = document.createElement('img');
                    imgLazyload.classList.add('lazyload');
                    imgLazyload.src = member.image_src; // Use src for lazyload placeholder/init
                    imgLazyload.alt = member.description;
                    cardDiv.appendChild(imgLazyload);

                    const noscript = document.createElement('noscript');
                    const imgNoScript = document.createElement('img');
                    imgNoScript.src = member.image_src;
                    imgNoScript.alt = member.description;
                    noscript.appendChild(imgNoScript);
                    cardDiv.appendChild(noscript);

                    // Name
                    const namePara = document.createElement('p');
                    namePara.textContent = member.name;
                    cardDiv.appendChild(namePara);

                    // Instrument
                    const descriptionPara = document.createElement('p');
                    descriptionPara.textContent = member.description;
                    cardDiv.appendChild(descriptionPara);

                    membersContainer.appendChild(cardDiv);
                });

          // Populate shows table
          const showsData = configDataRoot.shows

          // Clear any existing rows (in case you had placeholders)
          showsTableBody.innerHTML = '';

          // Populate the table
          showsData.forEach(show => {
              const row = document.createElement('tr');
              row.classList.add('animatableY'); // Apply your animation class

              const dateCell = document.createElement('td');
              dateCell.textContent = show.date;
              row.appendChild(dateCell);

              const eventLocationCell = document.createElement('td');
              const span = document.createElement('span');
              span.classList.add('white');
              const link = document.createElement('a');
              link.href = show.link;
              link.textContent = show.event;
              span.appendChild(link);
              eventLocationCell.appendChild(span);
              eventLocationCell.appendChild(document.createElement('br'));
              eventLocationCell.append(show.location); // Use append for text nodes and elements
              row.appendChild(eventLocationCell);

              const timeCell = document.createElement('td');
              timeCell.textContent = show.time;
              row.appendChild(timeCell);

              showsTableBody.appendChild(row);
          });

          // Populate merch items
          const merchData = configDataRoot.merch;

          merchContainer.innerHTML = ''; // Clear existing content

          merchData.forEach(item => {
              const cardDiv = document.createElement('div');
              cardDiv.classList.add('merch-card', 'animatableY');

              const imagePaths = JSON.stringify(item.images.map(img => img.path));
              cardDiv.dataset.images = imagePaths;
              cardDiv.dataset.caption = item.name;

              const imagesDiv = document.createElement('div');
              imagesDiv.classList.add('merch-images');
              if (item.images && item.images.length > 0) {
                  const firstImg = document.createElement('img');
                  firstImg.src = item.images[0].path;
                  firstImg.alt = item.name;
                  imagesDiv.appendChild(firstImg);
              }
              cardDiv.appendChild(imagesDiv);

              const detailsDiv = document.createElement('div');
              detailsDiv.classList.add('merch-details');
              const nameH3 = document.createElement('h3');
              nameH3.textContent = item.name;
              detailsDiv.appendChild(nameH3);

              const priceP = document.createElement('p');
              priceP.classList.add('price');
              priceP.textContent = item.price;
              detailsDiv.appendChild(priceP);

              const descP = document.createElement('p');
              descP.textContent = item.description;
              detailsDiv.appendChild(descP);
              cardDiv.appendChild(detailsDiv);

              merchContainer.appendChild(cardDiv);
          });

          // Attach a single click listener for all merch cards
          merchContainer.addEventListener('click', (event) => {
              const card = event.target.closest('.merch-card');
              if (!card) return;

              // Set the global state for the modal to this merch item's images
              currentImageSet = JSON.parse(card.dataset.images);
              currentIndex = 0;
              console.log("merch click ", currentImageSet)

              const caption = card.dataset.caption;
              openModal(currentImageSet[currentIndex], caption);
          });
      })
      .catch(error => {
          console.error('Error fetching or parsing YAML:', error);
          showsTableBody.innerHTML = '<tr><td colspan="3">Failed to load show data.</td></tr>';
      });

        // --- MODAL FUNCTIONS (now unified) ---

    function openModal(imagePath, captionText) {
       console.log("OpenModal ", imagePath, captionText)
        modalImage.src = imagePath;
        modalImage.alt = captionText;
        modalCaption.textContent = captionText;
        modal.style.display = 'flex';

        if (currentImageSet.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        // Reset the state when the modal closes
        currentImageSet = [];
        currentIndex = 0;
    }

    // --- MODAL LISTENERS ---

    document.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    prevBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (currentImageSet.length > 0) {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentImageSet.length - 1;
            openModal(currentImageSet[currentIndex], modalCaption.textContent);
        }
    });

    nextBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (currentImageSet.length > 0) {
            currentIndex = (currentIndex < currentImageSet.length - 1) ? currentIndex + 1 : 0;
            openModal(currentImageSet[currentIndex], modalCaption.textContent);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });

    // --- INITIALIZE ALL COMPONENTS ---
    setupGallery();

})

// Manage vidéo
$(function () {
    $('video').on('click', function(event) {
      event.preventDefault();
      document.getElementById('tucoVideo').play();
    });
})

// Manage form
$(function () {
    // Name
      $('#nom').on('blur input', function () {
        if ($('#nom').val().length >= 50) {
          $('#helpNom').text('50 characters max').hide().show();
        } else {
          $('#helpNom').slideUp(400);
        }
      })
      // Phone
        $('#telephone').on('blur input', function () {
            let regexTelephone = /[0]{1}[1-7]{1}[0-9]{8}/;
            let telEntry = String(document.getElementById('telephone').value);
            for (var i = 0; i < telEntry.length; i++) {
              telEntry = telEntry.replace(" ", "");
            }
            if (!telEntry.match(regexTelephone)) {
                $('#helpTel').text('Incorrect phone number').hide().show();
            } else {
                $('#helpTel').slideUp(400);
            }
        })

    // Email
        $('#mail').on('blur input', function () {
          let regexMail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
          let mailEntry = $('input#mail').val();
          if (!mailEntry.match(regexMail)) {
            $('#helpMail').text('Incorrect email address').hide().show();
          } else {
            $('#helpMail').slideUp(400);
          }
        })
    // Check Robot
        $('#checkRobot').on('blur input', function () {
            if ($('#checkRobot').val() != 7) {
              $('#helpRobot').text('Incorrect result of the operation').hide().show();
            } else {
              $('#helpRobot').slideUp(400);
            }
        })
    // Message
        $('#message').on('blur input', function () {
          if ($('#message').val().length >= 3000) {
              $('#helpMessage').text('Your message must not exceed 3000 characters').hide().slideDown(400);
          } else {
            $('#helpMessage').slideUp(400);
          }
        })
  })

// Contact form
$(function () {
      $('.contactForm').on('submit', function (e) {
          e.preventDefault();
          let nom = $('#nom').val();
          let telephone = $('#telephone').val();
          let mail = $('#mail').val();
          let message = $('#message').val();
          let newsletter = $('input[name="newsletter"]:checked').val();
          let checkRobot = $('#checkRobot').val();
          if ($('#checkRobot').val() == 7) {
              $.post('../datas/sendFormContact.php',
                      {nom: nom,
                        telephone: telephone,
                        mail: mail,
                        message: message,
                        newsletter: newsletter,
                        checkRobot: checkRobot },
                        function(data, textStatus, xhr) {
                            $('form').fadeOut(400, function() {
                                $('#retourFormulaire').css({"padding": "10px",
                                                            "margin-top": "160px",
                                                            "margin-bottom": "160px",
                                                            "margin-left": "auto",
                                                            "margin-right": "auto",
                                                            "color": "white",
                                                            "font-size": "1rem",
                                                            "text-align": "center"});
                                $('#retourFormulaire').html(data);
                            });
                            $('#nom').val('');
                            $('#telephone').val('');
                            $('#mail').val('');
                            $('#message').val('');
                            $('#checkRobot').val('');
                          });
            } else {
                alert('Incorrect anti robot check result !');
            }

      })
})

// Form newsletter input blur
$(function () {
  let regexMail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
    $('#emailNews').on('blur input', function(event) {
        //event.preventDefault();
        let mailEntry = $('#emailNews').val();
        if (!mailEntry.match(regexMail)) {
          $('#helpMailNews').text('Incorrect email address').hide().show();
          $('#hideNews').hide();
        } else {
          $('#helpMailNews').slideUp(100, function () {
            // Apparition checkRobotNews
            $('#hideNews').fadeIn();
          });
        }
    });
    $('#checkRobotNews').on('blur input', function(event) {
        if ($('#checkRobotNews').val() != 7) {
          $('#helpMailNews').text('Incorrect result').hide().show();
        } else {
          $('#helpMailNews').slideUp(100, function () {
          });
        }
    });
})

// Form newsletter ajax send
$(function () {
      $('.newsletterForm').on('submit', function (e) {
          e.preventDefault();
          let mail = $('#emailNews').val();
          let checkRobot = $('#checkRobotNews').val();
          if ($('#checkRobotNews').val() == 7 ) {
              $.post('../datas/sendFormSubscription.php',
                      { mail: mail,
                        checkRobot: checkRobot },
                        function(data, textStatus, xhr) {
                            $('.newsletterForm').fadeOut(400, function() {
                                $('#retourNewsFormulaire').css({"padding": "10px",
                                                            "margin-top": "60px",
                                                            "margin-bottom": "60px",
                                                            "margin-left": "auto",
                                                            "margin-right": "auto",
                                                            "color": "white",
                                                            "font-size": "1rem",
                                                            "text-align": "center"});
                                $('#retourNewsFormulaire').html(data);
                            });
                            $('#emailNews').val('');
                            $('#checkRobotNews').val('');
                          });
            } else {
                alert('Incorrect anti robot check result !');
            }

      })
})

// Animations on scroll
$(function () {
    $(window).on('scroll', function () {
        let sizePage = $(window).height();
        let trigger = 100;
        // Animation en Y
        let element = document.getElementsByClassName('animatableY');
        for (var unit of element) {
          if (unit.getBoundingClientRect().top + trigger <= sizePage) {
            unit.classList.add('showed');
          }
        }

        // Animation en X
        let elementh2 = document.getElementsByClassName('animatableX');
        for (var unit of elementh2) {
          if (unit.getBoundingClientRect().top + trigger <= sizePage) {
            unit.classList.add('showed');
          }
        }

        // Animation opacity
        let elementOpacity = document.getElementsByClassName('animatableOpacity');
        for (var unit of elementOpacity) {
          if (unit.getBoundingClientRect().top + trigger <= sizePage) {
            unit.classList.add('showed');
          }
        }
    })
})

//Lazyload
$(function () {
  if (!window.location.pathname.match("mentions")) {
    lazyload();
  }
})

// resize reload
$(function () {
  let initialWidth = $(window).innerWidth();
  $(window).on('resize', function () {
    let newWidth = $(window).innerWidth();
    if (initialWidth != newWidth) {
      document.location.reload(true);
    }
  })
})

// Manage scroll up button
$(function () {
    let ecran = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      $(window).on('scroll', function () {
        let scrollNow = $(window).scrollTop();
        $(window).on('scroll', function functionName() {
          if (scrollNow > 600 && scrollNow > $(window).scrollTop()) {
            if ($('#upArrow').is(":hidden")) {
              $('#upArrow').show();
            }
          } else {
            $('#upArrow').hide();
          }
        })
        $('#upArrow').on('click', function () {
            $(window).scrollTop(0);
        })
      })
})

// Delete scroll tag on scroll down
$(function () {
    $(window).on('scroll', function () {
        let topPage = $(window).scrollTop();
        if (topPage >= 150) {
          $('#scrollDown').hide();
        } else {
          $('#scrollDown').show();
        }
    })
})
// Manage tag scroll down
$(function () {
    $('#scrollDown').on('click', function() {
      window.location.href = "#nextShow";
    });
})

// Locations
$(function () {
    //$(".card").on('click', () => {window.location.href = "https://www.instagram.com/"});
})
// Location socials
$(function () {
    $('.facebook').on('click', function(event) {
      event.preventDefault();
      window.location.href = "https://www.facebook.com/sickdayskapela";
    });
    $('.instagram').on('click', function(event) {
      event.preventDefault();
      window.location.href = "https://www.instagram.com/sickdays_official/";
    });
})
