/**
 * Set up search form functionality
 * @param {Element} headerBlock The header block element
 */
function setupSearchForm(headerBlock) {
  // Library search form
  const searchForm = headerBlock.querySelector('#uws-library-BJA-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', () => {
      const searchInput = this.querySelector('[data-role="search-input"]');
      const searchString = this.querySelector('#uws-search-string');

      if (searchInput && searchString && searchInput.value) {
        searchString.value = `any,contains,${searchInput.value}`;
      }
    });

    // Search context switcher
    const searchContextRadios = searchForm.querySelectorAll('[data-type="search-context"]');
    searchContextRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        const searchType = this.value;
        const form = this.closest('form');

        if (form && searchType) {
          if (searchType === 'site_search') {
            form.action = 'https://uws.primo.exlibrisgroup.com/discovery/search';
          } else if (searchType === 'library_search') {
            form.action = 'https://www.westernsydney.edu.au/search';
          }
        }
      });
    });

    // Ensure the search button has the right styling
    const searchButton = searchForm.querySelector('.search-catalogue_btn');
    if (searchButton) {
      searchButton.innerHTML = 'Search';
    }
  }
}
/**
 * Initialize header functionality
 * @param {Element} headerBlock The header block element
 */
function initializeHeader(headerBlock) {
  // Toggle Sign In dropdown
  const signInBtn = headerBlock.querySelector('#sign_in_dd');
  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      signInBtn.classList.toggle('active');
      const dropdownWrap = headerBlock.querySelector('.dropdown_wrap');
      if (dropdownWrap) {
        dropdownWrap.classList.toggle('active');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.sign_in_dd')) {
        const dropdownWrap = headerBlock.querySelector('.dropdown_wrap');
        if (dropdownWrap && dropdownWrap.classList.contains('active')) {
          dropdownWrap.classList.remove('active');
          signInBtn.classList.remove('active');
        }
      }
    });
  }

  // Make sure search_tab is always visible and positioned correctly
  const searchTab = headerBlock.querySelector('.search_tab');
  if (searchTab) {
    // Ensure the search_tab is visible and properly styled
    searchTab.style.display = 'flex';
    searchTab.style.visibility = 'visible';
    searchTab.style.opacity = '1';
  }

  // Toggle QuickLinks
  const quicklinksTab = headerBlock.querySelector('.quicklinks_tab');
  if (quicklinksTab) {
    quicklinksTab.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      quicklinksTab.classList.toggle('quicklinks_tab_active');
      const quicklinks = headerBlock.querySelector('.quicklinks');
      const quicklinksSlider = headerBlock.querySelector('.quicklinks_slider');

      if (quicklinks) {
        quicklinks.classList.toggle('active');
      }

      if (quicklinksSlider) {
        quicklinksSlider.classList.toggle('active');
      }
    });

    // Close quicklinks when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target.closest('#component_1932595') && !event.target.closest('.quicklinks')) {
        const quicklinks = headerBlock.querySelector('.quicklinks');
        const quicklinksSlider = headerBlock.querySelector('.quicklinks_slider');

        if (quicklinks && quicklinks.classList.contains('active')) {
          quicklinks.classList.remove('active');
          quicklinksTab.classList.remove('quicklinks_tab_active');
        }

        if (quicklinksSlider && quicklinksSlider.classList.contains('active')) {
          quicklinksSlider.classList.remove('active');
        }
      }
    });
  }

  // Mobile menu toggle
  const mainNavBtn = headerBlock.querySelector('.main-nav__btn');
  const mainNavWrapper = headerBlock.querySelector('.main-nav__wrapper');
  const mainNavClose = headerBlock.querySelector('.main-nav-close');

  if (mainNavBtn && mainNavWrapper) {
    mainNavBtn.addEventListener('click', () => {
      mainNavWrapper.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
  }

  if (mainNavClose && mainNavWrapper) {
    mainNavClose.addEventListener('click', () => {
      mainNavWrapper.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    });
  }

  // Sub navigation toggle for mobile
  const subNavBtns = headerBlock.querySelectorAll('.sub-nav-btn');
  subNavBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentLi = btn.closest('li');
      const subNav = parentLi.querySelector('.sub-nav');

      if (parentLi && subNav) {
        parentLi.classList.toggle('active');
        subNav.classList.toggle('active');
      }
    });
  });
  // Setup search form functionality
  setupSearchForm(headerBlock);
}

/**
 * Decorates the header with functionality based on the header.html structure
 * @param {Element} block The header block element
 */
export default function decorate(block) {
  // Clear the block content
  block.textContent = '';

  // Create the header HTML structure based on header.html
  block.innerHTML = `
    <div class="header-top-bg">
      <div class="header__top">
        <!-- Top header primary links -->
        <ul class="primary_links">
          <li><a href="https://www.westernsydney.edu.au/">Western Sydney University</a></li>
          <li><a href="https://vuws.westernsydney.edu.au/">vUWS</a></li>
          <li><a href="https://westernsydney.edu.au/studysmart">Study Smart</a></li>
          <li><a href="https://directory.westernsydney.edu.au/">Staff Directory</a></li>
          <li><a href="https://payments.westernsydney.edu.au/">OneStop</a></li>
          <li><a href="http://handle.uws.edu.au:8081/1959.7/primo_login">My Library</a></li>
        </ul>
        <!-- /Top header primary links -->

        <ul class="social_links">
          <li>
            <a href="javascript:window.print();">
              <img src="https://library.westernsydney.edu.au/__data/assets/file/0003/1932555/print-icon.svg">
            </a>
          </li>
          <li>
            <a href="https://twitter.com/westsydulibrary">
              <img
                src="https://library.westernsydney.edu.au/__data/assets/git_bridge/0008/2087738/mysource_files/twitter-x-icon..svg">
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/westsydulibrary/">
              <img src="https://library.westernsydney.edu.au/__data/assets/file/0011/1932554/insta-icon.svg">
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/westsydulibrary">
              <img src="https://library.westernsydney.edu.au/__data/assets/file/0006/1932549/facebook-icon.svg">
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/user/UWSLibrary">
              <img class="youtube-icon"
                src="https://library.westernsydney.edu.au/__data/assets/file/0003/1944309/youtube.svg">
            </a>
          </li>
        </ul>

        <!-- Top header Sign into section -->
        <div id="component_1932591">
          <div class="sign_in_dd">
            <button id="sign_in_dd">Sign In</button>
            <!-- Sign into listing -->
            <div class="dropdown_wrap">
              <div class="sign_in__dd_ul">
                <div class="wrap dd_1">
                  <span class="h3">Staff</span>
                  <ul class="dropdown">
                    <li><a class="a__extra a__top_drop" href="https://directory.westernsydney.edu.au">Staff Directory</a>
                    </li>
                    <li><a class="a__extra a__top_drop" href="https://www.westernsydney.edu.au/staffonline">Staff Online</a>
                    </li>
                    <li><a class="a__extra a__top_drop" href="https://outlook.com/owa/westernsydney.edu.au">Staff Email</a>
                    </li>
                    <li><a class="a__extra a__top_drop" href="https://westernaccount.westernsydney.edu.au/">Password
                        Management</a></li>
                  </ul>
                </div>
                <div class="wrap dd_1">
                  <span class="h3">Students</span>
                  <ul class="dropdown">
                    <li><a class="a__extra a__top_drop" href="http://handle.uws.edu.au:8081/1959.7/primo_login">My
                        Library</a></li>
                    <li><a class="a__extra a__top_drop" href="https://vuws.westernsydney.edu.au">vUWS</a></li>
                    <li><a class="a__extra a__top_drop" href="https://www.westernsydney.edu.au/mywestern">MyWestern</a></li>
                    <li><a class="a__extra a__top_drop" href="https://outlook.office.com/">Student Email</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- /Sign into listing -->
          </div>
        </div>
        <!-- /Top header Sign into section -->

        <!-- Top header quicklinks -->
        <div id="component_1932595">
          <div class="quicklinks" id="quicklinks">
            <div class="quicklinks_inner">
              <!-- List quicklinks -->
              <div id="quicklinks_slider" class="quicklinks_slider">
                <div class="quicklinks_slider_wrapper">
                  <div class="quicklinks_list">
                    <span class="heading">Governance</span>
                    <ul>
                      <li><a href="https://westernsydney.edu.au/about_uws/leadership/vcs_biography">Vice-Chancellor</a></li>
                      <li><a href="https://westernsydney.edu.au/about_uws/leadership/strategic_plan">Leadership and
                          Governance</a></li>
                      <li><a href="https://westernsydney.edu.au/policy/policy_dds">Policies</a></li>
                      <li><a href="https://www.westernsydney.edu.au/education-quality">Education Quality</a></li>
                      <li><a
                          href="https://westernsydney.edu.au/driving_sustainability/sustainability_education">Sustainability</a>
                      </li>
                    </ul>
                  </div>
                  <div class="quicklinks_list">
                    <span class="heading">People</span>
                    <ul>
                      <li><a href="https://directory.westernsydney.edu.au">Staff Directory</a></li>
                      <li><a href="http://www.westernsydney.edu.au/staff_profiles">Staff Profiles</a></li>
                      <li><a href="https://staffonline.uws.edu.au/">Staff Online</a></li>
                      <li><a href="http://www.westernsydney.edu.au/employment">Employment</a></li>
                      <li><a href="https://westernsydney.edu.au/human_resources/ohr">Office of Human Resources</a></li>
                    </ul>
                  </div>
                  <div class="quicklinks_list">
                    <span class="heading">Students</span>
                    <ul>
                      <li><a href="https://westernsydney.edu.au/currentstudents/current_students/dates">Important Dates</a>
                      </li>
                      <li><a href="https://www.westernsydney.edu.au/starting/enrolling/how_do_i_enrol">Accept and Enrol</a>
                      </li>
                      <li><a href="https://payments.westernsydney.edu.au/WSU/menu">Payments</a></li>
                      <li><a href="https://westernsydney.edu.au/currentstudents/current_students/forms">Student Forms</a>
                      </li>
                      <li><a href="https://www.westernsydney.edu.au/careers/home">Jobs for Students</a></li>
                    </ul>
                  </div>
                  <div class="quicklinks_list">
                    <span class="heading">Study</span>
                    <ul>
                      <li><a href="https://www.westernsydney.edu.au/future_students">Future Students</a></li>
                      <li><a href="https://hbook.westernsydney.edu.au/">Handbook</a></li>
                      <li><a href="">Scholarships</a></li>
                      <li><a
                          href="https://westernsydney.edu.au/currentstudents/current_students/enrolment/class_registration">Class
                          Registration</a></li>
                      <li><a href="https://online.westernsydney.edu.au">Online Courses</a></li>
                    </ul>
                  </div>
                  <div class="quicklinks_list">
                    <span class="heading">Services</span>
                    <ul>
                      <li><a href="https://westernaccount.westernsydney.edu.au/">Password Management</a></li>
                      <li><a href="https://westernsydney.edu.au/information_technology_services/its/airuws_lite">Western
                          Wifi - Wireless</a></li>
                      <li><a
                          href="https://www.westernsydney.edu.au/future/future_students_home/studentlife/accommodation">Accommodation</a>
                      </li>
                      <li><a
                          href="https://westernsydney.edu.au/badanami/badanami_centre_for_indigenous_education">Badanami</a>
                      </li>
                    </ul>
                  </div>
                  <div class="quicklinks_list">
                    <span class="heading">Partners</span>
                    <ul>
                      <li><a href="https://www.westernsydney.edu.au/future/study/application-pathways/the-college.html">The
                          College</a></li>
                      <li><a href="http://www.whitlam.org/">Whitlam Institute</a></li>
                      <li><a href="https://www.westernsydney.edu.au/launch-pad.html">Launch Pad</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- /List quicklinks -->
              <div class="search_tab">
                <button class="quicklinks_tab">QuickLinks</button>
                <!-- <a class="quicklinks_tab" href="#">QuickLinks</a> -->
                <div class="inp_wrap inp_w__search">
                  <div id="content_container_1415664">
                    <form method="get" class="search__form js-search-form search__form-inverse"
                      data-partial-url="//westernsydney-search.clients.squiz.net/s/suggest.json" data-partial-results="5"
                      action="https://www.westernsydney.edu.au/search?collection=wsu-library" data-action="self">
                      <input type="hidden" name="collection" value="wsu-library">
                      <!-- wsu-global -->
                      <div class="search__form-wrapper">
                        <div class="search__input">
                          <label class="sr-only" for="search-input">Search query</label>
                          <input type="text" class="inp_search" name="query" autocomplete="on" placeholder="Search"
                            id="search-input">
                        </div>
                        <div class="search__predictive-list js-search-list" style="display: none;"></div>
                        <input type="submit" class="search_btn">
                        <span class="sr-only">Submit</span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /Top header quicklinks -->
      </div>
    </div>
    <div class="header-main">
      <!-- Top section with logos and search -->
      <div class="header-main-top">
        <div class="header-main__logos">
          <a href="https://www.westernsydney.edu.au" rel="nofollow" class="header-main__main-logo-link">
            <img src="https://library.westernsydney.edu.au/__data/assets/file/0010/1932661/WSU-main-logo.svg" alt="uws logo"
              class="header-main__main-logo-img">
          </a>
          <a href="https://library.westernsydney.edu.au" rel="nofollow" class="header-main__library-logo-link">
            <img src="https://library.westernsydney.edu.au/__data/assets/file/0007/1934863/WSU-library-logo.svg"
              alt="uws logo" class="header-library__library-logo-img">
          </a>
        </div>
        <div class="search-catalogue">
          <form data-role="wsu-search-switcher" id="uws-library-BJA-search-form" class="search-catalogue__form" method="get"
            action="https://uws.primo.exlibrisgroup.com/discovery/search?vid=61UWSTSYD_INST:UWS_ALMA&amp;search_scope=MyInst_and_CI&amp;lang=en&amp;tab=Everything&amp;offset=0&amp;query=any,contains,"
            onsubmit="return BJA_form_submit();" target="_blank">

            <div class="search__form-wrapper">
              <div class="search-catalogue__input">
                <input type="hidden" name="vid" value="61UWSTSYD_INST:UWS_ALMA">
                <input type="hidden" name="search_scope" value="MyInst_and_CI">
                <input type="hidden" name="lang" value="en">
                <input type="hidden" name="tab" value="Everything">
                <input type="hidden" name="offset" value="0">

                <input type="hidden" name="query" id="uws-search-string" value="">
                <input type="text" data-role="search-input" name="query_placeholder" id="uws-search-form"
                  placeholder="Search">
              </div>
              <input type="submit" value="Search" id="uws-search-button" class="search-catalogue_btn">
            </div>

            <div class="search-catalogue__switcher-controls">
              <div class="search-catalogue__control-group">
                <input type="radio" id="site-search" data-type="search-context" value="site_search" name="search-method"
                  checked="">
                <label for="site-search">Search Library Collections</label>
              </div>

              <div class="search-catalogue__control-group">
                <input type="radio" id="library-search" data-type="search-context" value="library_search"
                  name="search-method">
                <label for="library-search">Search Library Website</label>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Main navigation below logos and search -->
      <div class="main-nav">
        <button type="button" class="main-nav__btn">
          <img src="https://library.westernsydney.edu.au/__data/assets/file/0005/1932728/hamburger.svg"
            alt="hamburger icon">
        </button>
        <div class="main-nav__wrapper">
          <button type="button" class="main-nav-close">
            <img src="https://library.westernsydney.edu.au/__data/assets/file/0006/1932729/white-close-icon.svg"
              alt="close icon">
          </button>
          <ul>
            <li class="has-sub">
              <a href="https://library.westernsydney.edu.au/about_us">About Us</a>
              <button type="button" class="sub-nav-btn">
                <span class="sr-only">Open sub nav</span>
              </button>
              <ul class="sub-nav">
                <li>
                  <a href="https://library.westernsydney.edu.au/about_us/membership">Membership &amp; Borrowing</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/about_us/campus">Campus Libraries</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/about_us/using_the_library">Using the Library</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/about_us/alumni">Alumni</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/about_us/faqs">FAQs</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/about_us/contact_us">Contact Us</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/about_us/rules_policies">Rules &amp; Policies</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/about_us/whats_on">What's On</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/about_us/news">News</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/about_us/strategies">Plans &amp; Strategies</a>
                </li>
              </ul>
            </li>
            <li class="has-sub">
              <a href="https://library.westernsydney.edu.au/collections">Collections</a>
              <button type="button" class="sub-nav-btn">
                <span class="sr-only">Open sub nav</span>
              </button>
              <ul class="sub-nav">
                <li>
                  <a href="https://library.westernsydney.edu.au/collections/about_our_collections">About Our Collections</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/collections/e-resources">e-Resources</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/collections/rpr">Research Profiles and Repository</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/collections/special_collections">Special Collections</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/collections/indigenous_resources">Indigenous Resources</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/collections/whitlam_prime_ministerial_collection">Whitlam
                    Prime Ministerial Collection</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/collections/beyond_our_collections">Document Delivery &amp;
                    External Collections</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/collections/collection_suggestions">Collection
                    Suggestions</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/collections/open_athens">OpenAthens</a>
                </li>
              </ul>
            </li>
            <li class="has-sub">
              <a href="https://library.westernsydney.edu.au/students">Students</a>
              <button type="button" class="sub-nav-btn">
                <span class="sr-only">Open sub nav</span>
              </button>
              <ul class="sub-nav">
                <li>
                  <a href="https://library.westernsydney.edu.au/students/study_smart">Study Smart</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/students/subject_essentials">Subject Essentials</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/students/academic_integrity">Academic Integrity</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/students/referencing-citation">Referencing &amp;
                    Citation</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/students/exam_papers">Exam Papers</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/students/distance_students">Distance Students</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/students/offshore_students">Offshore Students</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/students/disability_services">Disability Services</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/students/study-breaks">Study Breaks</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/students/rules_and_policies">Rules &amp; Policies</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/students/using_the_library">Using the Library</a>
                </li>
              </ul>
            </li>
            <li class="has-sub">
              <a href="https://library.westernsydney.edu.au/teaching">Teaching</a>
              <button type="button" class="sub-nav-btn">
                <span class="sr-only">Open sub nav</span>
              </button>
              <ul class="sub-nav">
                <li>
                  <a href="https://library.westernsydney.edu.au/teaching/school_librarians">School Librarians</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/teaching/academic_and_information_literacy">Academic &amp;
                    Information Literacy</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/teaching/linking_to_library_resources">Linking to Library
                    Resources</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/teaching/managing_readings_lists">Managing Reading Lists</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/teaching/open_textbooks_and_oer">Western Open Books</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/teaching/copyright_guidance">Copyright Guidance</a>
                </li>
              </ul>
            </li>
            <li class="has-sub">
              <a href="https://library.westernsydney.edu.au/researchers">Researchers</a>
              <button type="button" class="sub-nav-btn">
                <span class="sr-only">Open sub nav</span>
              </button>
              <ul class="sub-nav">
                <li>
                  <a href="https://library.westernsydney.edu.au/researchers/submit-publication">Submit a Research Output</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/researchers/conducting-research">Conducting Research</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/researchers/data-management">Research Data Management</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/researchers/develop_publishing_plan">Develop a Publishing
                    Plan</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/researchers/openaccessfeesupport">Open Access Publishing Fee
                    Support</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/researchers/request_doi_or_isbn">Request a DOI or ISBN</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/researchers/western_open_books">Western Open Books</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/researchers/systematic_reviews">Systematic Reviews &amp;
                    Covidence</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/researchers/research_toolkit">Researcher Toolkit</a>
                </li>
              </ul>
            </li>
            <li class="has-sub">
              <a href="https://library.westernsydney.edu.au/quick_links">Quick Links</a>
              <button type="button" class="sub-nav-btn">
                <span class="sr-only">Open sub nav</span>
              </button>
              <ul class="sub-nav">
                <li>
                  <a href="https://library.westernsydney.edu.au/quick_links/endnote_and_citationtools">EndNote &amp;
                    Citation Tools</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/quick_links/group_study_rooms">Student Group Study Rooms</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/quick_links/study_smart">Study Smart</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/quick_links/study_smart_appointments">Study Smart
                    Appointments</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/quick_links/subject_guides">Subject Guides</a>
                </li>
                <li>
                  <a href="https://library.westernsydney.edu.au/quick_links/subject_outlines">Subject Outlines</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="https://library.westernsydney.edu.au/library_hours">Library Hours</a>
            </li>
            <li>
              <a href="https://library.westernsydney.edu.au/my_library">My Library Account</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;
  // Update the search form placeholder to match the screenshot
  const searchInput = block.querySelector('#uws-search-form');
  if (searchInput) {
    searchInput.placeholder = 'Find books, journals, databases and more...';
  }
  // Initialize header functionality
  initializeHeader(block);
}