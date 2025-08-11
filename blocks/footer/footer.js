/**
 * Decorates the footer with functionality based on the footer.html structure
 * @param {Element} block The footer block element
 */
export default function decorate(block) {
  // Clear the block content
  block.textContent = '';

  // Create the footer HTML structure based on footer.html
  block.innerHTML = `
    <div class="footer__wrapper">
      <div class="footer__contact">
        <h5>Contact Us:</h5>
        <!-- Footer contact us content -->
        <ul>
          <li>
            <a class="phone" href="tel:+610298525353">02 9852 5353</a>
          </li>
          <li>
            <a class="email" href="https://answers.library.westernsydney.edu.au/form">Email Us</a>
          </li>
          <li>
            <span class="address">University Library<br>
              Locked Bag 1797,<br>
              Penrith<br>
              NSW 2751
            </span>
          </li>
        </ul>
        <!-- /Footer contact us content -->
      </div>
      <div class="footer__follow">
        <div class="footer__follow-social">
          <h5>Follow Us:</h5>
          <ul>
            <li>
              <a class="footer-twitter" href="http://twitter.com/westsydulibrary">
                <span>Twitter</span>
              </a>
            </li>
            <li>
              <a class="footer-insta" href="https://www.instagram.com/westsydulibrary/">
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a class="footer-facebook" href="https://www.facebook.com/westsydulibrary">
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a class="footer-youtube" href="https://www.youtube.com/user/UWSLibrary">
                <span>youtube</span>
              </a>
            </li>
          </ul>
        </div>
              <div class="footer__follow-connect">
        <h5>Connect with the app:</h5>
        <ul>
          <li>
            <a class="footer-apple-app-store"
              href="https://apps.apple.com/kw/app/western-sydney-uni-library/id6738176592?platform=iphone"
              target="__blank">
              <img
                src="https://library.westernsydney.edu.au/__data/assets/git_bridge/0008/2087738/mysource_files/apple-app-store..png"
                alt="Apple App Store Icon">
            </a>
          </li>
          <li>
            <a class="footer-google-play-store"
              href="https://play.google.com/store/apps/details?id=com.ombiel.campusm.westernsydney&amp;hl=en_AU"
              target="__blank">
              <img
                src="https://library.westernsydney.edu.au/__data/assets/git_bridge/0008/2087738/mysource_files/google-play-store..png"
                alt="Google Play Store Icon">
            </a>
          </li>
        </ul>
      </div>
      </div>

      <div class="footer__primary-links">
        <!-- Footer primary links listing -->
        <ul>
          <li>
            <a href="https://library.westernsydney.edu.au/home">Home</a>
          </li>
          <li>
            <a href="https://library.westernsydney.edu.au/about_us">About Us</a>
          </li>
          <li>
            <a href="https://library.westernsydney.edu.au/collections">Collections</a>
          </li>
          <li>
            <a href="https://library.westernsydney.edu.au/students">Students</a>
          </li>
          <li>
            <a href="https://library.westernsydney.edu.au/teaching">Teaching</a>
          </li>
          <li>
            <a href="https://library.westernsydney.edu.au/researchers">Researchers</a>
          </li>
          <li>
            <a href="https://library.westernsydney.edu.au/quick_links">Quick Links</a>
          </li>
          <li>
            <a href="https://library.westernsydney.edu.au/library_hours">Library Hours</a>
          </li>
          <li>
            <a href="https://library.westernsydney.edu.au/my_library">My Library Account</a>
          </li>
        </ul>
        <!-- /Footer primary links listing -->
      </div>
      <div class="footer__secondary-links">
        <!-- Footer secondary links listing -->
        <ul>
          <li><a href="https://www.westernsydney.edu.au/footer/privacy">Privacy Policy</a></li>
          <li><a href="https://library.westernsydney.edu.au/sitemap.xml">Sitemap</a></li>
          <li><a href="https://www.westernsydney.edu.au/footer/emergency_help">Emergency Contact</a></li>
          <li><a href="https://library.westernsydney.edu.au/about_us/contact_us">Library Contact</a></li>
        </ul>
        <!-- /Footer secondary links listing -->
        <p>Western Sydney University Copyright © 2004–2022 ABN 53 014 069 881 CRICOS Provider No: 00917K</p>
      </div>
    </div>
  `;

  // Initialize footer functionality
  initializeFooter(block);
}

/**
 * Initialize footer functionality
 * @param {Element} footerBlock The footer block element
 */
function initializeFooter(footerBlock) {
  // Add any necessary event listeners or functionality for the footer
  // Currently, the footer doesn't require any JavaScript functionality
}
